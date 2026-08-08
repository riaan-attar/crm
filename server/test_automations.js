require('dotenv').config({ path: __dirname + '/.env' });
const { sequelize, Automation, AutomationStep, AutomationLog, Lead } = require('./models');
const { runAutomationsForTrigger } = require('./services/automationEngine');

async function testAutomationSystem() {
  console.log('=== STARTING AUTOMATION ENGINE INTEGRATION TEST ===');
  try {
    await sequelize.authenticate();
    console.log('1. Database connected.');

    await sequelize.sync();
    console.log('2. Database models synchronized successfully.');

    // Clean up test automations
    await Automation.destroy({ where: { name: 'Welcome New Lead Test' } });

    // Create Test Automation
    const auto = await Automation.create({
      name: 'Welcome New Lead Test',
      description: 'Test automation workflow for lead creation',
      triggerType: 'lead_created',
      triggerConfig: {},
      isActive: true,
    });

    console.log(`3. Created test automation ID: ${auto.id}`);

    // Create steps: 1) send_message, 2) add_tag, 3) condition
    const step1 = await AutomationStep.create({
      automationId: auto.id,
      position: 0,
      stepType: 'send_message',
      stepConfig: { text: 'Welcome {{lead.firstName}}! Your inquiry has been received.' },
    });

    const step2 = await AutomationStep.create({
      automationId: auto.id,
      position: 1,
      stepType: 'add_tag',
      stepConfig: { tag_id: 'TestTag' },
    });

    const stepCond = await AutomationStep.create({
      automationId: auto.id,
      position: 2,
      stepType: 'condition',
      stepConfig: { subject: 'lead_status', operand: 'New' },
    });

    const stepYes = await AutomationStep.create({
      automationId: auto.id,
      parentStepId: stepCond.id,
      branch: 'yes',
      position: 0,
      stepType: 'update_contact_field',
      stepConfig: { field: 'status', value: 'Auto-Contacted' },
    });

    console.log('4. Created step tree (send_message -> add_tag -> condition -> update_contact_field).');

    // Create a dummy lead if needed
    let lead = await Lead.findByPk('LEAD-TEST-001');
    if (!lead) {
      lead = await Lead.create({
        id: 'LEAD-TEST-001',
        firstName: 'TestUser',
        lastName: 'Automation',
        email: 'test@automation.com',
        status: 'New',
        territory: 'Nashik',
      });
    }

    console.log(`5. Triggering automation engine for lead ${lead.id}...`);

    await runAutomationsForTrigger({
      triggerType: 'lead_created',
      leadId: lead.id,
      context: {
        lead: lead.toJSON(),
      },
    });

    console.log('6. Engine dispatch finished. Checking logs and execution state...');

    const log = await AutomationLog.findOne({
      where: { automationId: auto.id },
      order: [['createdAt', 'DESC']],
    });

    if (!log) {
      throw new Error('FAILED: No automation log was recorded!');
    }

    console.log('7. Log retrieved successfully:');
    console.log('   - Status:', log.status);
    console.log('   - Trigger Event:', log.triggerEvent);
    console.log('   - Steps Executed:', JSON.stringify(log.stepsExecuted, null, 2));

    const updatedAuto = await Automation.findByPk(auto.id);
    console.log(`   - Automation Execution Count: ${updatedAuto.executionCount}`);

    if (log.status !== 'success') {
      throw new Error(`FAILED: Expected status "success", got "${log.status}"`);
    }

    console.log('=== ALL AUTOMATION TESTS PASSED SUCCESSFULLY! ===');
    process.exit(0);
  } catch (err) {
    console.error('=== TEST FAILED ===', err);
    process.exit(1);
  }
}

testAutomationSystem();
