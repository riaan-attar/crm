const { Automation, AutomationStep, AutomationLog, AutomationPendingExecution, sequelize } = require('../models');
const { runAutomationsForTrigger, resumePendingExecutions } = require('../services/automationEngine');

/**
 * Format flat DB rows into tree for Builder/Frontend
 */
function buildStepsTree(steps = []) {
  const rootSteps = [];
  const map = {};

  steps.forEach(step => {
    const s = step.toJSON ? step.toJSON() : step;
    map[s.id] = { ...s, branches: { yes: [], no: [] } };
  });

  steps.forEach(step => {
    const s = map[step.id];
    if (!s.parentStepId) {
      rootSteps.push(s);
    } else if (map[s.parentStepId]) {
      const parent = map[s.parentStepId];
      const branchKey = s.branch === 'no' ? 'no' : 'yes';
      parent.branches[branchKey].push(s);
    }
  });

  // Sort by position
  const sortTree = (list) => {
    list.sort((a, b) => a.position - b.position);
    list.forEach(node => {
      if (node.branches) {
        sortTree(node.branches.yes);
        sortTree(node.branches.no);
      }
    });
  };

  sortTree(rootSteps);
  return rootSteps;
}

/**
 * Save tree steps into DB
 */
async function saveStepsTree(automationId, builderSteps = [], transaction) {
  // Clear existing steps first
  await AutomationStep.destroy({ where: { automationId }, transaction });

  if (!builderSteps || !builderSteps.length) return;

  async function walkAndInsert(nodes, parentId = null, branch = null) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const stepRow = await AutomationStep.create({
        automationId,
        parentStepId: parentId,
        branch,
        stepType: node.stepType || node.step_type,
        stepConfig: node.stepConfig || node.step_config || {},
        position: i,
      }, { transaction });

      if (node.stepType === 'condition' || node.step_type === 'condition') {
        const yesNodes = node.branches?.yes || [];
        const noNodes = node.branches?.no || [];
        if (yesNodes.length) await walkAndInsert(yesNodes, stepRow.id, 'yes');
        if (noNodes.length) await walkAndInsert(noNodes, stepRow.id, 'no');
      }
    }
  }

  await walkAndInsert(builderSteps, null, null);
}

// ------------------------------------------------------------
// Controller Functions
// ------------------------------------------------------------

exports.getAllAutomations = async (req, res) => {
  try {
    const automations = await Automation.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: AutomationStep, as: 'steps', attributes: ['id'] }],
    });

    const result = automations.map(a => {
      const json = a.toJSON();
      json.stepCount = json.steps ? json.steps.length : 0;
      delete json.steps;
      return json;
    });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[automationsController] getAll error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAutomationById = async (req, res) => {
  try {
    const { id } = req.params;
    const automation = await Automation.findByPk(id, {
      include: [{ model: AutomationStep, as: 'steps' }],
    });

    if (!automation) {
      return res.status(404).json({ success: false, message: 'Automation not found' });
    }

    const data = automation.toJSON();
    data.treeSteps = buildStepsTree(data.steps || []);

    res.json({ success: true, data });
  } catch (err) {
    console.error('[automationsController] getById error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAutomation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, description, triggerType, triggerConfig, isActive, steps } = req.body;

    if (!name || !triggerType) {
      return res.status(400).json({ success: false, message: 'Name and triggerType are required' });
    }

    const automation = await Automation.create({
      name,
      description,
      triggerType,
      triggerConfig: triggerConfig || {},
      isActive: Boolean(isActive),
    }, { transaction: t });

    if (steps && steps.length) {
      await saveStepsTree(automation.id, steps, t);
    }

    await t.commit();

    const result = await Automation.findByPk(automation.id, {
      include: [{ model: AutomationStep, as: 'steps' }],
    });
    const json = result.toJSON();
    json.treeSteps = buildStepsTree(json.steps || []);

    res.status(201).json({ success: true, data: json });
  } catch (err) {
    await t.rollback();
    console.error('[automationsController] create error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAutomation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { name, description, triggerType, triggerConfig, isActive, steps } = req.body;

    const automation = await Automation.findByPk(id);
    if (!automation) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Automation not found' });
    }

    await automation.update({
      name: name !== undefined ? name : automation.name,
      description: description !== undefined ? description : automation.description,
      triggerType: triggerType !== undefined ? triggerType : automation.triggerType,
      triggerConfig: triggerConfig !== undefined ? triggerConfig : automation.triggerConfig,
      isActive: isActive !== undefined ? Boolean(isActive) : automation.isActive,
    }, { transaction: t });

    if (steps !== undefined) {
      await saveStepsTree(automation.id, steps, t);
    }

    await t.commit();

    const updated = await Automation.findByPk(id, {
      include: [{ model: AutomationStep, as: 'steps' }],
    });
    const json = updated.toJSON();
    json.treeSteps = buildStepsTree(json.steps || []);

    res.json({ success: true, data: json });
  } catch (err) {
    await t.rollback();
    console.error('[automationsController] update error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAutomation = async (req, res) => {
  try {
    const { id } = req.params;
    const automation = await Automation.findByPk(id);
    if (!automation) {
      return res.status(404).json({ success: false, message: 'Automation not found' });
    }

    await automation.destroy();
    res.json({ success: true, message: 'Automation deleted successfully' });
  } catch (err) {
    console.error('[automationsController] delete error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.duplicateAutomation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const original = await Automation.findByPk(id, {
      include: [{ model: AutomationStep, as: 'steps' }],
    });

    if (!original) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Automation not found' });
    }

    const tree = buildStepsTree(original.steps || []);

    const copy = await Automation.create({
      name: `${original.name} (Copy)`,
      description: original.description,
      triggerType: original.triggerType,
      triggerConfig: original.triggerConfig,
      isActive: false,
    }, { transaction: t });

    await saveStepsTree(copy.id, tree, t);

    await t.commit();

    const result = await Automation.findByPk(copy.id, {
      include: [{ model: AutomationStep, as: 'steps' }],
    });
    const json = result.toJSON();
    json.treeSteps = buildStepsTree(json.steps || []);

    res.status(201).json({ success: true, data: json });
  } catch (err) {
    await t.rollback();
    console.error('[automationsController] duplicate error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAutomationLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const where = id ? { automationId: id } : {};

    const logs = await AutomationLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 100,
      include: [{ model: Automation, attributes: ['id', 'name'] }],
    });

    res.json({ success: true, data: logs });
  } catch (err) {
    console.error('[automationsController] getLogs error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.triggerEngine = async (req, res) => {
  try {
    const { triggerType, leadId, contactId, context } = req.body;
    if (!triggerType) {
      return res.status(400).json({ success: false, message: 'triggerType is required' });
    }

    await runAutomationsForTrigger({ triggerType, leadId, contactId, context });
    res.json({ success: true, message: 'Engine dispatch completed' });
  } catch (err) {
    console.error('[automationsController] triggerEngine error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.processCron = async (req, res) => {
  try {
    await resumePendingExecutions();
    res.json({ success: true, message: 'Cron pending execution check complete' });
  } catch (err) {
    console.error('[automationsController] processCron error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
