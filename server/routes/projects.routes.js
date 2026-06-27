const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller');

// Helper to define standard CRUD routes
const setupCrudRoutes = (path, controller) => {
  router.get(path, controller.getAll);
  router.get(`${path}/:id`, controller.getById);
  router.post(path, controller.create);
  router.put(`${path}/:id`, controller.update);
  router.delete(`${path}/:id`, controller.delete);
};

// Mount Projects entities
setupCrudRoutes('/project', projectsController.projects);
setupCrudRoutes('/task', projectsController.tasks);
setupCrudRoutes('/timesheet', projectsController.timesheets);

module.exports = router;
