const express = require('express');
const router = express.Router();
const controller = require('../controllers/automations.controller');

// CRUD Endpoints
router.get('/', controller.getAllAutomations);
router.post('/', controller.createAutomation);
router.get('/logs', controller.getAutomationLogs);
router.get('/:id', controller.getAutomationById);
router.put('/:id', controller.updateAutomation);
router.delete('/:id', controller.deleteAutomation);
router.post('/:id/duplicate', controller.duplicateAutomation);
router.get('/:id/logs', controller.getAutomationLogs);

// Engine & Cron Endpoints
router.post('/engine/dispatch', controller.triggerEngine);
router.post('/cron/process-pending', controller.processCron);

module.exports = router;
