const { Project, ProjectTask, Timesheet } = require('../models');

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

// Generic controller creator for Projects Module
const createCrudController = (Model, prefix) => {
  const modelName = prefix.toLowerCase() === 'proj' ? 'project' : (prefix.toLowerCase() === 'task' ? 'task' : 'timesheet');
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
        const createdOn = req.body.createdOn || new Date().toLocaleDateString('en-GB');
        const item = await Model.create({ ...req.body, id, createdOn });
        
        const io = req.app.get('io');
        if (io) {
          io.emit('projects:update', { model: modelName, action: 'create', data: item });
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
          io.emit('projects:update', { model: modelName, action: 'update', data: item });
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
          io.emit('projects:update', { model: modelName, action: 'delete', data: { id } });
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
  projects: createCrudController(Project, 'PROJ'),
  tasks: createCrudController(ProjectTask, 'TASK'),
  timesheets: createCrudController(Timesheet, 'TS'),
};
