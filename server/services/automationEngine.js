const { Automation, AutomationStep, AutomationLog, AutomationPendingExecution, Lead, Contact, Opportunity, Communication } = require('../models');

/**
 * Utility to interpolate strings like "Hello {{lead.firstName}}, your message was {{message.text}}"
 */
function interpolate(template = '', args = {}) {
  if (!template) return '';
  return template.replace(/\{\{\s*([\w\.-]+)\s*\}\}/g, (match, path) => {
    const parts = path.split('.');
    let val = args;
    for (const part of parts) {
      if (val && typeof val === 'object' && part in val) {
        val = val[part];
      } else {
        return match;
      }
    }
    return val !== undefined && val !== null ? String(val) : '';
  });
}

/**
 * Whole word pattern matcher (Unicode safe)
 */
function matchesWholeWord(text = '', keyword = '', caseSensitive = false) {
  if (!keyword || !text) return false;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, caseSensitive ? 'u' : 'iu');
  return pattern.test(text);
}

/**
 * Check if an active automation's trigger matches the incoming event context
 */
function triggerMatches(automation, ctx = {}) {
  const triggerType = automation.triggerType;
  const cfg = automation.triggerConfig || {};

  if (triggerType === 'keyword_match') {
    const keywords = cfg.keywords || [];
    if (!keywords.length) return false;
    const text = ctx.messageText || ctx.message_text || '';
    if (!text) return false;

    if (cfg.match_type === 'word') {
      return keywords.some(raw => matchesWholeWord(text, raw, cfg.case_sensitive));
    }
    const haystack = cfg.case_sensitive ? text : text.toLowerCase();
    return keywords.some(raw => {
      const k = cfg.case_sensitive ? raw : raw.toLowerCase();
      return cfg.match_type === 'exact' ? haystack === k : haystack.includes(k);
    });
  }

  if (triggerType === 'interactive_reply') {
    const replyId = ctx.interactive_reply_id || ctx.replyId;
    const replyIds = cfg.reply_ids || [];
    if (!replyId || !replyIds.length) return false;
    return replyIds.includes(replyId);
  }

  if (triggerType === 'tag_added') {
    const tagId = ctx.tag_id || ctx.tagId;
    return Boolean(tagId && cfg.tag_id && cfg.tag_id === tagId);
  }

  if (triggerType === 'stage_changed') {
    if (cfg.stage && ctx.stage && cfg.stage !== ctx.stage) {
      return false;
    }
    return true;
  }

  return true;
}

/**
 * Calculate delay in milliseconds from wait config
 */
function parseWaitMs(cfg = {}) {
  const amount = Number(cfg.amount) || 1;
  const unit = cfg.unit || 'hours';
  switch (unit) {
    case 'minutes': return amount * 60 * 1000;
    case 'hours': return amount * 60 * 60 * 1000;
    case 'days': return amount * 24 * 60 * 60 * 1000;
    default: return amount * 60 * 60 * 1000;
  }
}

/**
 * Main Entry Point: Dispatch automations for a given trigger
 */
async function runAutomationsForTrigger(input = {}) {
  const { triggerType, leadId, contactId, context = {} } = input;
  if (!triggerType) return;

  try {
    const automations = await Automation.findAll({
      where: {
        triggerType,
        isActive: true,
      },
      include: [{ model: AutomationStep, as: 'steps' }],
    });

    if (!automations || automations.length === 0) return;

    // Load Lead/Contact details for interpolation
    let lead = null;
    if (leadId) {
      lead = await Lead.findByPk(leadId);
    }

    const fullContext = {
      ...context,
      lead: lead ? lead.toJSON() : {},
      vars: context.vars || {},
    };

    for (const automation of automations) {
      if (!triggerMatches(automation, fullContext)) continue;

      try {
        await executeAutomation(automation, { leadId, contactId, context: fullContext, lead });
      } catch (err) {
        console.error(`[automationEngine] Failed running automation ${automation.id}:`, err);
      }
    }
  } catch (err) {
    console.error('[automationEngine] Dispatch failed:', err);
  }
}

/**
 * Execute a single matching automation
 */
async function executeAutomation(automation, input) {
  const log = await AutomationLog.create({
    automationId: automation.id,
    leadId: input.leadId || null,
    contactId: input.contactId || null,
    triggerEvent: automation.triggerType,
    stepsExecuted: [],
    status: 'failed',
  });

  await executeStepsFrom({
    automation,
    leadId: input.leadId || null,
    contactId: input.contactId || null,
    lead: input.lead,
    context: input.context || {},
    parentStepId: null,
    branch: null,
    startPosition: 0,
    logId: log.id,
  });

  // Increment execution counter
  await automation.increment('executionCount', { by: 1 });
  await automation.update({ lastExecutedAt: new Date() });
}

/**
 * Execute steps starting from parent/branch scope
 */
async function executeStepsFrom(args) {
  const { automation, leadId, contactId, lead, context, parentStepId, branch, startPosition, logId } = args;

  const whereClause = {
    automationId: automation.id,
    parentStepId: parentStepId || null,
  };
  if (parentStepId) {
    whereClause.branch = branch || 'yes';
  }

  const steps = await AutomationStep.findAll({
    where: whereClause,
    order: [['position', 'ASC']],
  });

  if (!steps || steps.length === 0) {
    if (parentStepId === null && logId) {
      await finalizeLog(logId, 'success', null);
    }
    return;
  }

  const results = [];
  let status = 'success';
  let errorMessage = null;

  for (const step of steps) {
    if (step.position < startPosition) continue;

    if (step.stepType === 'wait') {
      const ms = parseWaitMs(step.stepConfig);
      await AutomationPendingExecution.create({
        automationId: automation.id,
        leadId,
        contactId,
        logId,
        parentStepId,
        branch,
        nextStepPosition: step.position + 1,
        context,
        runAt: new Date(Date.now() + ms),
        status: 'pending',
      });

      results.push({
        step_id: step.id,
        step_type: step.stepType,
        status: 'success',
        detail: `Waiting ${step.stepConfig?.amount || 1} ${step.stepConfig?.unit || 'hours'}`,
      });
      status = 'partial';
      await appendResults(logId, results, status, errorMessage);
      return;
    }

    try {
      if (step.stepType === 'condition') {
        const taken = await evaluateCondition(step.stepConfig, { leadId, contactId, lead, context });
        results.push({
          step_id: step.id,
          step_type: 'condition',
          status: 'success',
          detail: `branch=${taken ? 'yes' : 'no'}`,
        });

        await executeStepsFrom({
          ...args,
          parentStepId: step.id,
          branch: taken ? 'yes' : 'no',
          startPosition: 0,
        });
        continue;
      }

      const detail = await runStep(step, { leadId, contactId, lead, context, automation });
      results.push({
        step_id: step.id,
        step_type: step.stepType,
        status: 'success',
        detail,
      });
    } catch (err) {
      const msg = err.message || String(err);
      results.push({
        step_id: step.id,
        step_type: step.stepType,
        status: 'failed',
        detail: msg,
      });
      status = 'failed';
      errorMessage = msg;
      break;
    }
  }

  await appendResults(logId, results, parentStepId === null ? status : null, errorMessage);
}

/**
 * Execute an individual step action
 */
async function runStep(step, args) {
  const { leadId, lead, context, automation } = args;
  const cfg = step.stepConfig || {};

  switch (step.stepType) {
    case 'send_message': {
      const text = interpolate(cfg.text, context);
      if (!text.trim()) throw new Error('send_message text is empty');

      // Log communication record in CRM database
      if (leadId) {
        await Communication.create({
          id: `COMM-${Date.now()}`,
          linkedId: leadId,
          linkedType: 'Lead',
          communicationType: 'WhatsApp',
          sender: 'System Automation',
          recipient: lead ? (lead.mobileNo || lead.email) : 'Lead',
          subject: `Automated: ${automation.name}`,
          content: text,
          status: 'Sent',
          createdOn: new Date().toISOString(),
        });
      }
      return `Sent message: "${text.slice(0, 40)}..."`;
    }

    case 'add_tag': {
      if (leadId && cfg.tag_id) {
        const curLead = await Lead.findByPk(leadId);
        if (curLead) {
          const tags = curLead.territory ? curLead.territory.split(', ') : [];
          if (!tags.includes(cfg.tag_id)) {
            tags.push(cfg.tag_id);
            await curLead.update({ territory: tags.join(', ') });
          }
        }
      }
      return `Tag '${cfg.tag_id || 'N/A'}' added`;
    }

    case 'remove_tag': {
      if (leadId && cfg.tag_id) {
        const curLead = await Lead.findByPk(leadId);
        if (curLead && curLead.territory) {
          const tags = curLead.territory.split(', ').filter(t => t !== cfg.tag_id);
          await curLead.update({ territory: tags.join(', ') });
        }
      }
      return `Tag '${cfg.tag_id || 'N/A'}' removed`;
    }

    case 'update_contact_field': {
      if (!leadId) throw new Error('update_contact_field requires a lead');
      const val = interpolate(cfg.value, context);
      const field = cfg.field;
      const allowed = ['status', 'leadSource', 'budgetRange', 'preferredArea', 'propertyType', 'organization', 'jobTitle'];

      if (allowed.includes(field)) {
        await Lead.update({ [field]: val }, { where: { id: leadId } });
        return `Updated field '${field}' to '${val}'`;
      }
      return `Field '${field}' updated`;
    }

    case 'create_deal': {
      if (!leadId) throw new Error('create_deal requires a lead');
      const title = interpolate(cfg.title || 'New Automated Deal', context);
      await Opportunity.create({
        id: `OPP-${Date.now()}`,
        linkedLeadId: leadId,
        opportunityName: title,
        stage: cfg.stage_id || 'Prospecting',
        amount: cfg.value || 0,
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      return `Created deal '${title}'`;
    }

    case 'send_webhook': {
      if (!cfg.url) throw new Error('send_webhook missing url');
      const body = cfg.body_template ? interpolate(cfg.body_template, context) : JSON.stringify(context);
      const res = await fetch(cfg.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(cfg.headers || {}) },
        body: typeof body === 'string' ? body : JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
      return `Webhook POST success (${res.status})`;
    }

    case 'assign_conversation': {
      if (!leadId) throw new Error('assign_conversation requires a lead');
      const agent = cfg.agent_id || 'Admin User';
      await Lead.update({ leadOwner: agent }, { where: { id: leadId } });
      return `Assigned lead to '${agent}'`;
    }

    case 'close_conversation': {
      if (leadId) {
        await Lead.update({ status: 'Closed' }, { where: { id: leadId } });
      }
      return 'Lead closed';
    }

    default:
      return `Executed ${step.stepType}`;
  }
}

/**
 * Evaluate condition steps
 */
async function evaluateCondition(cfg = {}, args = {}) {
  const { lead } = args;
  switch (cfg.subject) {
    case 'lead_status':
      return lead && lead.status === cfg.operand;
    case 'time_of_day': {
      const now = new Date();
      const hour = now.getHours();
      if (cfg.operand === '18:00-09:00') {
        return hour >= 18 || hour < 9;
      }
      return true;
    }
    case 'custom_field':
      return lead && String(lead[cfg.field] || '') === String(cfg.operand || '');
    default:
      return true;
  }
}

/**
 * Update AutomationLog row
 */
async function appendResults(logId, newResults, finalStatus, errorMessage) {
  if (!logId) return;
  const log = await AutomationLog.findByPk(logId);
  if (!log) return;

  const existing = log.stepsExecuted || [];
  const merged = [...existing, ...newResults];
  const updatePayload = { stepsExecuted: merged };

  if (finalStatus) {
    updatePayload.status = finalStatus;
  }
  if (errorMessage) {
    updatePayload.errorMessage = errorMessage;
  }

  await log.update(updatePayload);
}

async function finalizeLog(logId, status, errorMessage) {
  if (!logId) return;
  await AutomationLog.update(
    { status, errorMessage },
    { where: { id: logId } }
  );
}

/**
 * Resume execution parked at a wait step (Cron handler)
 */
async function resumePendingExecutions() {
  const now = new Date();
  const pendings = await AutomationPendingExecution.findAll({
    where: {
      status: 'pending',
      runAt: { [require('sequelize').Op.lte]: now },
    },
  });

  for (const pending of pendings) {
    await pending.update({ status: 'running' });

    const automation = await Automation.findByPk(pending.automationId);
    if (!automation) {
      await pending.update({ status: 'failed' });
      continue;
    }

    try {
      const lead = pending.leadId ? await Lead.findByPk(pending.leadId) : null;
      await executeStepsFrom({
        automation,
        leadId: pending.leadId,
        contactId: pending.contactId,
        lead,
        context: pending.context || {},
        parentStepId: pending.parentStepId,
        branch: pending.branch,
        startPosition: pending.nextStepPosition,
        logId: pending.logId,
      });
      await pending.update({ status: 'done' });
    } catch (err) {
      console.error(`[automationEngine] Resume execution failed for ${pending.id}:`, err);
      await pending.update({ status: 'failed' });
    }
  }
}

module.exports = {
  runAutomationsForTrigger,
  resumePendingExecutions,
  interpolate,
};
