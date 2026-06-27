const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

// Helper to define standard CRUD routes
const setupCrudRoutes = (path, controller) => {
  router.get(path, controller.getAll);
  router.get(`${path}/:id`, controller.getById);
  router.post(path, controller.create);
  router.put(`${path}/:id`, controller.update);
  router.delete(`${path}/:id`, controller.delete);
};

// Main Stock Documents
setupCrudRoutes('/stock-entries', stockController.stockEntries);
setupCrudRoutes('/purchase-receipts', stockController.purchaseReceipts);
setupCrudRoutes('/delivery-notes', stockController.deliveryNotes);
setupCrudRoutes('/material-requests', stockController.materialRequests);
setupCrudRoutes('/pick-lists', stockController.pickLists);

// Setup
setupCrudRoutes('/warehouses', stockController.warehouses);
setupCrudRoutes('/items', stockController.items);
setupCrudRoutes('/item-groups', stockController.itemGroups);
setupCrudRoutes('/uoms', stockController.uoms);

// Tools
setupCrudRoutes('/serial-nos', stockController.serialNos);
setupCrudRoutes('/batches', stockController.batches);
setupCrudRoutes('/quality-inspections', stockController.qualityInspections);

module.exports = router;
