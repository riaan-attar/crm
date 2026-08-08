const sequelize = require('../config/db');

// Import models
const Lead = require('./Lead.model');
const Opportunity = require('./Opportunity.model');
const Customer = require('./Customer.model');
const Contact = require('./Contact.model');
const Campaign = require('./Campaign.model');
const Contract = require('./Contract.model');
const Communication = require('./Communication.model');
const Maintenance = require('./Maintenance.model');
const Organization = require('./Organization.model');
const Note = require('./Note.model');
const Task = require('./Task.model');
const CallLog = require('./CallLog.model');
const EmailTemplate = require('./EmailTemplate.model');
const User = require('./User.model');
const Integration = require('./Integration.model');
const OauthAccount = require('./OauthAccount.model');
const WebhookLog = require('./WebhookLog.model');
const SyncJob = require('./SyncJob.model');
const Automation = require('./Automation.model');
const AutomationStep = require('./AutomationStep.model');
const AutomationLog = require('./AutomationLog.model');
const AutomationPendingExecution = require('./AutomationPendingExecution.model');

// Define associations
Lead.hasMany(Opportunity, { foreignKey: 'linkedLeadId', as: 'opportunities' });
Opportunity.belongsTo(Lead, { foreignKey: 'linkedLeadId', as: 'lead' });

// Polymorphic Note Associations
Lead.hasMany(Note, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Lead' }, as: 'noteRecords' });
Opportunity.hasMany(Note, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Opportunity' }, as: 'noteRecords' });
Customer.hasMany(Note, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Customer' }, as: 'noteRecords' });
Contact.hasMany(Note, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Contact' }, as: 'noteRecords' });

Note.belongsTo(Lead, { foreignKey: 'linkedId', constraints: false, as: 'lead' });
Note.belongsTo(Opportunity, { foreignKey: 'linkedId', constraints: false, as: 'opportunity' });
Note.belongsTo(Customer, { foreignKey: 'linkedId', constraints: false, as: 'customer' });
Note.belongsTo(Contact, { foreignKey: 'linkedId', constraints: false, as: 'contact' });

// Polymorphic Task Associations
Lead.hasMany(Task, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Lead' }, as: 'tasks' });
Opportunity.hasMany(Task, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Opportunity' }, as: 'tasks' });
Customer.hasMany(Task, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Customer' }, as: 'tasks' });
Contact.hasMany(Task, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Contact' }, as: 'tasks' });

Task.belongsTo(Lead, { foreignKey: 'linkedId', constraints: false, as: 'lead' });
Task.belongsTo(Opportunity, { foreignKey: 'linkedId', constraints: false, as: 'opportunity' });
Task.belongsTo(Customer, { foreignKey: 'linkedId', constraints: false, as: 'customer' });
Task.belongsTo(Contact, { foreignKey: 'linkedId', constraints: false, as: 'contact' });

// Polymorphic CallLog Associations
Lead.hasMany(CallLog, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Lead' }, as: 'callLogs' });
Opportunity.hasMany(CallLog, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Opportunity' }, as: 'callLogs' });
Customer.hasMany(CallLog, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Customer' }, as: 'callLogs' });
Contact.hasMany(CallLog, { foreignKey: 'linkedId', constraints: false, scope: { linkedType: 'Contact' }, as: 'callLogs' });

CallLog.belongsTo(Lead, { foreignKey: 'linkedId', constraints: false, as: 'lead' });
CallLog.belongsTo(Opportunity, { foreignKey: 'linkedId', constraints: false, as: 'opportunity' });
CallLog.belongsTo(Customer, { foreignKey: 'linkedId', constraints: false, as: 'customer' });
CallLog.belongsTo(Contact, { foreignKey: 'linkedId', constraints: false, as: 'contact' });

// Automation Associations
Automation.hasMany(AutomationStep, { foreignKey: 'automationId', as: 'steps', onDelete: 'CASCADE' });
AutomationStep.belongsTo(Automation, { foreignKey: 'automationId' });

AutomationStep.hasMany(AutomationStep, { foreignKey: 'parentStepId', as: 'children', onDelete: 'CASCADE' });
AutomationStep.belongsTo(AutomationStep, { foreignKey: 'parentStepId', as: 'parent' });

Automation.hasMany(AutomationLog, { foreignKey: 'automationId', as: 'logs', onDelete: 'CASCADE' });
AutomationLog.belongsTo(Automation, { foreignKey: 'automationId' });
AutomationLog.belongsTo(Lead, { foreignKey: 'leadId', as: 'lead' });
AutomationLog.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });

module.exports = {
  sequelize,
  Lead,
  Opportunity,
  Customer,
  Contact,
  Campaign,
  Contract,
  Communication,
  Maintenance,
  Organization,
  Note,
  Task,
  CallLog,
  EmailTemplate,
  User,
  Integration,
  OauthAccount,
  WebhookLog,
  SyncJob,
  Automation,
  AutomationStep,
  AutomationLog,
  AutomationPendingExecution
};
