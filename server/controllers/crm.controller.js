const { Lead, Opportunity, Customer, Contact, Campaign, Contract, Communication, Maintenance, Organization, Note, Task, CallLog, EmailTemplate } = require('../models');

// Helper to generate custom sequential IDs
const generateNextId = async (Model, prefix) => {
  try {
    const latest = await Model.findOne({
      order: [['id', 'DESC']],
    });
    if (!latest || !latest.id || !latest.id.startsWith(prefix)) {
      return `${prefix}-0001`;
    }
    const parts = latest.id.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (isNaN(lastNum)) {
      return `${prefix}-0001`;
    }
    const nextNum = String(lastNum + 1).padStart(4, '0');
    return `${prefix}-${nextNum}`;
  } catch (error) {
    console.error(`Error generating next ID for prefix ${prefix}:`, error);
    return `${prefix}-0001`;
  }
};

// Generic controller creator
const createCrudController = (Model, prefix) => {
  const modelName = prefix.toLowerCase();
  return {
    getAll: async (req, res) => {
      try {
        const items = await Model.findAll({
          order: [['id', 'DESC']],
        });
        res.json(items);
      } catch (error) {
        console.error(`Error fetching ${prefix} items:`, error);
        res.status(500).json({ error: error.message });
      }
    },
    getById: async (req, res) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
      } catch (error) {
        console.error(`Error fetching ${prefix} item by ID:`, error);
        res.status(500).json({ error: error.message });
      }
    },
    create: async (req, res) => {
      try {
        const id = req.body.id || await generateNextId(Model, prefix);
        const createdOn = req.body.createdOn || new Date().toLocaleDateString('en-IN');
        const item = await Model.create({ ...req.body, id, createdOn });
        
        const io = req.app.get('io');
        if (io) {
          io.emit('crm:update', { model: modelName, action: 'create', data: item });
        }

        // Fire-and-forget automation triggers
        const { runAutomationsForTrigger } = require('../services/automationEngine');
        if (prefix === 'LEAD') {
          runAutomationsForTrigger({
            triggerType: 'lead_created',
            leadId: item.id,
            context: { lead: item.toJSON() }
          }).catch(err => console.error('Automation trigger error:', err));
        } else if (prefix === 'COMM') {
          runAutomationsForTrigger({
            triggerType: 'keyword_match',
            leadId: item.linkedId || null,
            context: { messageText: item.content }
          }).catch(err => console.error('Automation trigger error:', err));

          runAutomationsForTrigger({
            triggerType: 'new_message_received',
            leadId: item.linkedId || null,
            context: { messageText: item.content }
          }).catch(err => console.error('Automation trigger error:', err));
        }

        res.status(201).json(item);
      } catch (error) {
        console.error(`Error creating ${prefix} item:`, error);
        res.status(500).json({ error: error.message });
      }
    },
    update: async (req, res) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        await item.update(req.body);

        const io = req.app.get('io');
        if (io) {
          io.emit('crm:update', { model: modelName, action: 'update', data: item });
        }

        // Fire-and-forget automation triggers on status change
        const { runAutomationsForTrigger } = require('../services/automationEngine');
        if (prefix === 'LEAD') {
          runAutomationsForTrigger({
            triggerType: 'stage_changed',
            leadId: item.id,
            context: { lead: item.toJSON(), stage: item.status }
          }).catch(err => console.error('Automation trigger error:', err));
        }

        res.json(item);
      } catch (error) {
        console.error(`Error updating ${prefix} item:`, error);
        res.status(500).json({ error: error.message });
      }
    },
    delete: async (req, res) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        const id = item.id;
        await item.destroy();

        const io = req.app.get('io');
        if (io) {
          io.emit('crm:update', { model: modelName, action: 'delete', data: { id } });
        }

        res.json({ message: 'Deleted successfully' });
      } catch (error) {
        console.error(`Error deleting ${prefix} item:`, error);
        res.status(500).json({ error: error.message });
      }
    }
  };
};

module.exports = {
  leads: createCrudController(Lead, 'LEAD'),
  opportunities: createCrudController(Opportunity, 'OPP'),
  customers: createCrudController(Customer, 'CUST'),
  contacts: createCrudController(Contact, 'CON'),
  campaigns: createCrudController(Campaign, 'CMP'),
  contracts: createCrudController(Contract, 'CONT'),
  communications: createCrudController(Communication, 'COMM'),
  maintenances: createCrudController(Maintenance, 'MNT'),
  organizations: createCrudController(Organization, 'ORG'),
  notes: createCrudController(Note, 'NOTE'),
  tasks: createCrudController(Task, 'TASK'),
  callLogs: createCrudController(CallLog, 'CALL'),
  emailTemplates: createCrudController(EmailTemplate, 'TMPL'),
};
