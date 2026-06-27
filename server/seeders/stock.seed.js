const {
  sequelize,
  StockEntry,
  PurchaseReceipt,
  DeliveryNote,
  MaterialRequest,
  PickList,
  Warehouse,
  Item,
  ItemGroup,
  UnitOfMeasure,
  SerialNo,
  Batch,
  QualityInspection,
} = require('../models');

// ─── Seed Data ────────────────────────────────────────────────────────────────

const DEMO_UOMS = [
  { id: 'UOM-0001', name: 'Bag',   symbol: 'Bag',  description: 'Bag (50 kg)',            createdOn: '01/01/2026' },
  { id: 'UOM-0002', name: 'KG',    symbol: 'kg',   description: 'Kilogram',               createdOn: '01/01/2026' },
  { id: 'UOM-0003', name: 'Nos',   symbol: 'Nos',  description: 'Numbers / Pieces',       createdOn: '01/01/2026' },
  { id: 'UOM-0004', name: 'CFT',   symbol: 'cft',  description: 'Cubic Feet',             createdOn: '01/01/2026' },
  { id: 'UOM-0005', name: 'SqFt',  symbol: 'sqft', description: 'Square Feet',            createdOn: '01/01/2026' },
  { id: 'UOM-0006', name: 'Mtr',   symbol: 'm',    description: 'Metre',                  createdOn: '01/01/2026' },
  { id: 'UOM-0007', name: 'Litre', symbol: 'L',    description: 'Litre',                  createdOn: '01/01/2026' },
  { id: 'UOM-0008', name: 'Sheet', symbol: 'Sht',  description: 'Sheet',                  createdOn: '01/01/2026' },
  { id: 'UOM-0009', name: 'Set',   symbol: 'Set',  description: 'Set',                    createdOn: '01/01/2026' },
  { id: 'UOM-0010', name: 'MT',    symbol: 'MT',   description: 'Metric Tonne (1000 kg)', createdOn: '01/01/2026' },
];

const DEMO_ITEM_GROUPS = [
  { id: 'IG-0001', name: 'All Item Groups',        parentGroup: null,        isGroup: true,  description: 'Root group',                   createdOn: '01/01/2026' },
  { id: 'IG-0002', name: 'Construction Material',  parentGroup: 'All Item Groups', isGroup: false, description: 'Cement, bricks, sand etc.', createdOn: '01/01/2026' },
  { id: 'IG-0003', name: 'Steel',                  parentGroup: 'All Item Groups', isGroup: false, description: 'TMT bars, MS plates etc.',  createdOn: '01/01/2026' },
  { id: 'IG-0004', name: 'Aggregates',             parentGroup: 'All Item Groups', isGroup: false, description: 'Sand, gravel, aggregate',   createdOn: '01/01/2026' },
  { id: 'IG-0005', name: 'Finishing',              parentGroup: 'All Item Groups', isGroup: false, description: 'Tiles, paint, granite',     createdOn: '01/01/2026' },
  { id: 'IG-0006', name: 'Plumbing',               parentGroup: 'All Item Groups', isGroup: false, description: 'Pipes, fittings, valves',   createdOn: '01/01/2026' },
  { id: 'IG-0007', name: 'Electrical',             parentGroup: 'All Item Groups', isGroup: false, description: 'Wires, switches, panels',   createdOn: '01/01/2026' },
  { id: 'IG-0008', name: 'Wood & Timber',          parentGroup: 'All Item Groups', isGroup: false, description: 'Plywood, timber, doors',    createdOn: '01/01/2026' },
  { id: 'IG-0009', name: 'Tools & Equipment',      parentGroup: 'All Item Groups', isGroup: false, description: 'Power tools, hand tools',   createdOn: '01/01/2026' },
];

const DEMO_WAREHOUSES = [
  { id: 'WH-0001', name: 'Main Warehouse - BID',  warehouseType: 'Stores',           city: 'Nashik', address: 'BID Industrial Area, Nashik', stockValue: 2150000, createdOn: '01/01/2026' },
  { id: 'WH-0002', name: 'Gangapur Site Store',   warehouseType: 'Work In Progress', city: 'Nashik', address: 'Gangapur Road, Nashik',       stockValue: 980000,  createdOn: '01/01/2026' },
  { id: 'WH-0003', name: 'Nashik Road Store',     warehouseType: 'Stores',           city: 'Nashik', address: 'Nashik Road, Nashik',         stockValue: 620000,  createdOn: '01/01/2026' },
  { id: 'WH-0004', name: 'Satpur Site Store',     warehouseType: 'Work In Progress', city: 'Nashik', address: 'Satpur MIDC, Nashik',         stockValue: 340000,  createdOn: '01/01/2026' },
  { id: 'WH-0005', name: 'Finished Goods - BID',  warehouseType: 'Finished Goods',   city: 'Nashik', address: 'BID Industrial Area, Nashik', stockValue: 460000,  createdOn: '01/01/2026' },
];

const DEMO_ITEMS = [
  { id: 'ITEM-0001', name: 'Portland Cement',       itemGroup: 'Construction Material', uom: 'Bag',   rate: 380,  openingStock: 500,   currentStock: 180,  reorderLevel: 100,   warehouse: 'Gangapur Site Store',  hasSerialNo: false, hasBatchNo: true,  createdOn: '01/01/2026' },
  { id: 'ITEM-0002', name: 'Steel TMT Bars 12mm',   itemGroup: 'Steel',                 uom: 'KG',    rate: 65,   openingStock: 5000,  currentStock: 2200, reorderLevel: 1000,  warehouse: 'Gangapur Site Store',  hasSerialNo: false, hasBatchNo: false, createdOn: '01/01/2026' },
  { id: 'ITEM-0003', name: 'Red Clay Bricks',        itemGroup: 'Construction Material', uom: 'Nos',   rate: 8,    openingStock: 50000, currentStock: 18000,reorderLevel: 10000, warehouse: 'Nashik Road Store',    hasSerialNo: false, hasBatchNo: false, createdOn: '01/01/2026' },
  { id: 'ITEM-0004', name: 'River Sand',              itemGroup: 'Aggregates',            uom: 'CFT',   rate: 45,   openingStock: 2000,  currentStock: 750,  reorderLevel: 500,   warehouse: 'Satpur Site Store',    hasSerialNo: false, hasBatchNo: false, createdOn: '01/01/2026' },
  { id: 'ITEM-0005', name: 'Ceramic Floor Tiles',    itemGroup: 'Finishing',             uom: 'SqFt',  rate: 55,   openingStock: 8000,  currentStock: 3200, reorderLevel: 1000,  warehouse: 'Nashik Road Store',    hasSerialNo: false, hasBatchNo: false, createdOn: '01/01/2026' },
  { id: 'ITEM-0006', name: 'PVC Pipes 4 inch',       itemGroup: 'Plumbing',              uom: 'Nos',   rate: 320,  openingStock: 200,   currentStock: 45,   reorderLevel: 50,    warehouse: 'Gangapur Site Store',  hasSerialNo: false, hasBatchNo: false, createdOn: '01/01/2026' },
  { id: 'ITEM-0007', name: 'Electrical Wire 4mm',    itemGroup: 'Electrical',            uom: 'Mtr',   rate: 28,   openingStock: 5000,  currentStock: 1800, reorderLevel: 500,   warehouse: 'Main Warehouse - BID', hasSerialNo: false, hasBatchNo: false, createdOn: '01/01/2026' },
  { id: 'ITEM-0008', name: 'Granite Slabs',           itemGroup: 'Finishing',             uom: 'SqFt',  rate: 120,  openingStock: 3000,  currentStock: 1100, reorderLevel: 500,   warehouse: 'Main Warehouse - BID', hasSerialNo: false, hasBatchNo: false, createdOn: '01/01/2026' },
  { id: 'ITEM-0009', name: 'Paint - Exterior',        itemGroup: 'Finishing',             uom: 'Litre', rate: 180,  openingStock: 1000,  currentStock: 320,  reorderLevel: 200,   warehouse: 'Nashik Road Store',    hasSerialNo: false, hasBatchNo: true,  createdOn: '01/01/2026' },
  { id: 'ITEM-0010', name: 'Plywood 19mm',            itemGroup: 'Wood & Timber',         uom: 'Sheet', rate: 1800, openingStock: 300,   currentStock: 95,   reorderLevel: 50,    warehouse: 'Main Warehouse - BID', hasSerialNo: false, hasBatchNo: false, createdOn: '01/01/2026' },
  { id: 'ITEM-0011', name: 'Electric Drill',           itemGroup: 'Tools & Equipment',    uom: 'Nos',   rate: 4500, openingStock: 10,    currentStock: 6,    reorderLevel: 2,     warehouse: 'Gangapur Site Store',  hasSerialNo: true,  hasBatchNo: false, createdOn: '01/01/2026' },
  { id: 'ITEM-0012', name: 'Waterproofing Compound',  itemGroup: 'Construction Material', uom: 'Litre', rate: 250,  openingStock: 500,   currentStock: 200,  reorderLevel: 100,   warehouse: 'Main Warehouse - BID', hasSerialNo: false, hasBatchNo: true,  createdOn: '01/01/2026' },
];

const DEMO_STOCK_ENTRIES = [
  {
    id: 'STE-2026-0001',
    stockEntryType: 'Material Transfer',
    fromWarehouse: 'Main Warehouse - BID',
    toWarehouse: 'Gangapur Site Store',
    postingDate: '2026-06-10',
    totalValue: 85000,
    status: 'Submitted',
    remarks: 'Transfer for site construction',
    items: JSON.stringify([{ item: 'Portland Cement', qty: 100, rate: 380, amount: 38000 }, { item: 'Steel TMT Bars 12mm', qty: 700, rate: 65, amount: 45500 }]),
    createdOn: '10/06/2026',
  },
  {
    id: 'STE-2026-0002',
    stockEntryType: 'Material Issue',
    fromWarehouse: 'Gangapur Site Store',
    toWarehouse: '',
    postingDate: '2026-06-12',
    totalValue: 42000,
    status: 'Submitted',
    remarks: 'Issued for foundation work',
    items: JSON.stringify([{ item: 'River Sand', qty: 500, rate: 45, amount: 22500 }, { item: 'Red Clay Bricks', qty: 2438, rate: 8, amount: 19504 }]),
    createdOn: '12/06/2026',
  },
  {
    id: 'STE-2026-0003',
    stockEntryType: 'Material Receipt',
    fromWarehouse: '',
    toWarehouse: 'Main Warehouse - BID',
    postingDate: '2026-06-14',
    totalValue: 156000,
    status: 'Submitted',
    remarks: 'Received from Tata Steel supplier',
    items: JSON.stringify([{ item: 'Steel TMT Bars 12mm', qty: 2000, rate: 65, amount: 130000 }, { item: 'Plywood 19mm', qty: 15, rate: 1800, amount: 27000 }]),
    createdOn: '14/06/2026',
  },
  {
    id: 'STE-2026-0004',
    stockEntryType: 'Material Transfer',
    fromWarehouse: 'Main Warehouse - BID',
    toWarehouse: 'Nashik Road Store',
    postingDate: '2026-06-15',
    totalValue: 63000,
    status: 'Submitted',
    remarks: 'Transfer for Nashik Road project',
    items: JSON.stringify([{ item: 'Ceramic Floor Tiles', qty: 700, rate: 55, amount: 38500 }, { item: 'Granite Slabs', qty: 200, rate: 120, amount: 24000 }]),
    createdOn: '15/06/2026',
  },
  {
    id: 'STE-2026-0005',
    stockEntryType: 'Stock Reconciliation',
    fromWarehouse: '',
    toWarehouse: 'Satpur Site Store',
    postingDate: '2026-06-16',
    totalValue: 28000,
    status: 'Draft',
    remarks: 'Quarterly reconciliation',
    items: JSON.stringify([{ item: 'River Sand', qty: 200, rate: 45, amount: 9000 }, { item: 'Red Clay Bricks', qty: 2375, rate: 8, amount: 19000 }]),
    createdOn: '16/06/2026',
  },
  {
    id: 'STE-2026-0006',
    stockEntryType: 'Material Issue',
    fromWarehouse: 'Nashik Road Store',
    toWarehouse: '',
    postingDate: '2026-06-17',
    totalValue: 18500,
    status: 'Draft',
    remarks: 'Issued for flooring work',
    items: JSON.stringify([{ item: 'Ceramic Floor Tiles', qty: 200, rate: 55, amount: 11000 }, { item: 'Paint - Exterior', qty: 42, rate: 180, amount: 7500 }]),
    createdOn: '17/06/2026',
  },
];

const DEMO_PURCHASE_RECEIPTS = [
  {
    id: 'PRC-2026-0001',
    supplier: 'Shree Cement Ltd',
    postingDate: '2026-06-05',
    acceptedWarehouse: 'Gangapur Site Store',
    items: JSON.stringify([{ item: 'Portland Cement', qty: 200, rate: 380, amount: 76000 }]),
    totalQty: 200,
    totalAmount: 76000,
    status: 'Submitted',
    remarks: 'Monthly cement order',
    createdOn: '05/06/2026',
  },
  {
    id: 'PRC-2026-0002',
    supplier: 'Tata Steel',
    postingDate: '2026-06-07',
    acceptedWarehouse: 'Main Warehouse - BID',
    items: JSON.stringify([{ item: 'Steel TMT Bars 12mm', qty: 2000, rate: 65, amount: 130000 }]),
    totalQty: 2000,
    totalAmount: 130000,
    status: 'Submitted',
    remarks: 'Steel for Gangapur project',
    createdOn: '07/06/2026',
  },
  {
    id: 'PRC-2026-0003',
    supplier: 'Kajaria Ceramics',
    postingDate: '2026-06-09',
    acceptedWarehouse: 'Nashik Road Store',
    items: JSON.stringify([{ item: 'Ceramic Floor Tiles', qty: 2000, rate: 55, amount: 110000 }]),
    totalQty: 2000,
    totalAmount: 110000,
    status: 'Submitted',
    remarks: 'Tiles for Nashik Road project',
    createdOn: '09/06/2026',
  },
  {
    id: 'PRC-2026-0004',
    supplier: 'Local Sand Supplier',
    postingDate: '2026-06-11',
    acceptedWarehouse: 'Satpur Site Store',
    items: JSON.stringify([{ item: 'River Sand', qty: 500, rate: 45, amount: 22500 }]),
    totalQty: 500,
    totalAmount: 22500,
    status: 'Submitted',
    remarks: 'Sand for Satpur site',
    createdOn: '11/06/2026',
  },
  {
    id: 'PRC-2026-0005',
    supplier: 'Asian Paints',
    postingDate: '2026-06-14',
    acceptedWarehouse: 'Nashik Road Store',
    items: JSON.stringify([{ item: 'Paint - Exterior', qty: 200, rate: 180, amount: 36000 }]),
    totalQty: 200,
    totalAmount: 36000,
    status: 'Draft',
    remarks: 'Exterior paint for finishing',
    createdOn: '14/06/2026',
  },
  {
    id: 'PRC-2026-0006',
    supplier: 'Finolex Cables',
    postingDate: '2026-06-16',
    acceptedWarehouse: 'Main Warehouse - BID',
    items: JSON.stringify([{ item: 'Electrical Wire 4mm', qty: 1000, rate: 28, amount: 28000 }]),
    totalQty: 1000,
    totalAmount: 28000,
    status: 'Draft',
    remarks: 'Electrical wiring for new block',
    createdOn: '16/06/2026',
  },
];

const DEMO_DELIVERY_NOTES = [
  {
    id: 'DN-2026-0001',
    customer: 'Mohan Kulkarni',
    postingDate: '2026-06-08',
    fromWarehouse: 'Main Warehouse - BID',
    items: JSON.stringify([{ item: 'Ceramic Floor Tiles', qty: 500, rate: 55, amount: 27500 }]),
    totalQty: 500,
    totalAmount: 27500,
    status: 'Submitted',
    remarks: 'Delivery to Flat 302, Suyog Nagar',
    createdOn: '08/06/2026',
  },
  {
    id: 'DN-2026-0002',
    customer: 'Vikram Industries',
    postingDate: '2026-06-10',
    fromWarehouse: 'Main Warehouse - BID',
    items: JSON.stringify([{ item: 'Plywood 19mm', qty: 20, rate: 1800, amount: 36000 }]),
    totalQty: 20,
    totalAmount: 36000,
    status: 'Submitted',
    remarks: 'Delivery to Satpur MIDC site',
    createdOn: '10/06/2026',
  },
  {
    id: 'DN-2026-0003',
    customer: 'Sunita Bhosale',
    postingDate: '2026-06-12',
    fromWarehouse: 'Nashik Road Store',
    items: JSON.stringify([{ item: 'Granite Slabs', qty: 300, rate: 120, amount: 36000 }]),
    totalQty: 300,
    totalAmount: 36000,
    status: 'Submitted',
    remarks: 'Granite for kitchen renovation',
    createdOn: '12/06/2026',
  },
  {
    id: 'DN-2026-0004',
    customer: 'Rajesh Sharma',
    postingDate: '2026-06-15',
    fromWarehouse: 'Gangapur Site Store',
    items: JSON.stringify([{ item: 'PVC Pipes 4 inch', qty: 10, rate: 320, amount: 3200 }]),
    totalQty: 10,
    totalAmount: 3200,
    status: 'Draft',
    remarks: 'Plumbing material delivery',
    createdOn: '15/06/2026',
  },
  {
    id: 'DN-2026-0005',
    customer: 'Anita Desai',
    postingDate: '2026-06-18',
    fromWarehouse: 'Nashik Road Store',
    items: JSON.stringify([{ item: 'Paint - Exterior', qty: 50, rate: 180, amount: 9000 }]),
    totalQty: 50,
    totalAmount: 9000,
    status: 'Draft',
    remarks: 'Paint for penthouse exterior',
    createdOn: '18/06/2026',
  },
];

const DEMO_MATERIAL_REQUESTS = [
  {
    id: 'MR-2026-0001',
    requestedBy: 'Amit Kulkarni',
    purpose: 'Purchase',
    requiredDate: '2026-06-25',
    status: 'Pending',
    items: JSON.stringify([{ item: 'Portland Cement', qty: 200, uom: 'Bag' }, { item: 'Steel TMT Bars 12mm', qty: 500, uom: 'KG' }, { item: 'River Sand', qty: 100, uom: 'CFT' }]),
    totalItems: 3,
    remarks: 'Required for Phase 2 construction',
    createdOn: '18/06/2026',
  },
  {
    id: 'MR-2026-0002',
    requestedBy: 'Rahul Desai',
    purpose: 'Transfer',
    requiredDate: '2026-06-22',
    status: 'Transferred',
    items: JSON.stringify([{ item: 'Ceramic Floor Tiles', qty: 500, uom: 'SqFt' }, { item: 'Granite Slabs', qty: 200, uom: 'SqFt' }]),
    totalItems: 2,
    remarks: 'Transfer from main to Nashik Road site',
    createdOn: '17/06/2026',
  },
  {
    id: 'MR-2026-0003',
    requestedBy: 'Sneha Patil',
    purpose: 'Purchase',
    requiredDate: '2026-06-28',
    status: 'Draft',
    items: JSON.stringify([{ item: 'Paint - Exterior', qty: 100, uom: 'Litre' }, { item: 'Electrical Wire 4mm', qty: 500, uom: 'Mtr' }, { item: 'PVC Pipes 4 inch', qty: 30, uom: 'Nos' }, { item: 'Plywood 19mm', qty: 20, uom: 'Sheet' }, { item: 'Granite Slabs', qty: 100, uom: 'SqFt' }]),
    totalItems: 5,
    remarks: 'Finishing materials for Phase 3',
    createdOn: '16/06/2026',
  },
  {
    id: 'MR-2026-0004',
    requestedBy: 'Amit Kulkarni',
    purpose: 'Issue',
    requiredDate: '2026-06-20',
    status: 'Issued',
    items: JSON.stringify([{ item: 'Waterproofing Compound', qty: 50, uom: 'Litre' }]),
    totalItems: 1,
    remarks: 'Waterproofing for terrace',
    createdOn: '15/06/2026',
  },
  {
    id: 'MR-2026-0005',
    requestedBy: 'Rahul Desai',
    purpose: 'Purchase',
    requiredDate: '2026-06-30',
    status: 'Ordered',
    items: JSON.stringify([{ item: 'Red Clay Bricks', qty: 5000, uom: 'Nos' }, { item: 'Portland Cement', qty: 100, uom: 'Bag' }, { item: 'River Sand', qty: 200, uom: 'CFT' }, { item: 'Steel TMT Bars 12mm', qty: 1000, uom: 'KG' }]),
    totalItems: 4,
    remarks: 'Order placed with vendor',
    createdOn: '14/06/2026',
  },
  {
    id: 'MR-2026-0006',
    requestedBy: 'Sneha Patil',
    purpose: 'Transfer',
    requiredDate: '2026-06-24',
    status: 'Pending',
    items: JSON.stringify([{ item: 'Electrical Wire 4mm', qty: 300, uom: 'Mtr' }, { item: 'PVC Pipes 4 inch', qty: 20, uom: 'Nos' }]),
    totalItems: 2,
    remarks: 'MEP material for Gangapur site',
    createdOn: '13/06/2026',
  },
];

const DEMO_PICK_LISTS = [
  {
    id: 'PL-2026-0001',
    purpose: 'Delivery',
    warehouse: 'Main Warehouse - BID',
    picker: 'Rahul Desai',
    date: '2026-06-15',
    status: 'Open',
    items: JSON.stringify([{ item: 'Ceramic Floor Tiles', qty: 500, pickedQty: 0 }, { item: 'Plywood 19mm', qty: 20, pickedQty: 0 }]),
    createdOn: '15/06/2026',
  },
  {
    id: 'PL-2026-0002',
    purpose: 'Material Transfer',
    warehouse: 'Gangapur Site Store',
    picker: 'Amit Kulkarni',
    date: '2026-06-16',
    status: 'Completed',
    items: JSON.stringify([{ item: 'Portland Cement', qty: 50, pickedQty: 50 }, { item: 'River Sand', qty: 100, pickedQty: 100 }]),
    createdOn: '16/06/2026',
  },
  {
    id: 'PL-2026-0003',
    purpose: 'Delivery',
    warehouse: 'Nashik Road Store',
    picker: 'Sneha Patil',
    date: '2026-06-18',
    status: 'Open',
    items: JSON.stringify([{ item: 'Granite Slabs', qty: 300, pickedQty: 0 }, { item: 'Paint - Exterior', qty: 50, pickedQty: 0 }]),
    createdOn: '18/06/2026',
  },
  {
    id: 'PL-2026-0004',
    purpose: 'Material Transfer',
    warehouse: 'Main Warehouse - BID',
    picker: 'Rahul Desai',
    date: '2026-06-19',
    status: 'Draft',
    items: JSON.stringify([{ item: 'Electrical Wire 4mm', qty: 300, pickedQty: 0 }]),
    createdOn: '19/06/2026',
  },
];

const DEMO_SERIAL_NOS = [
  { id: 'SN-0001', item: 'Electric Drill',     itemCode: 'ITEM-0011', warehouse: 'Gangapur Site Store',  purchaseDate: '10/01/2026', status: 'Active',    supplier: 'Bosch Tools India', warrantyExpiry: '10/01/2028', createdOn: '10/01/2026' },
  { id: 'SN-0002', item: 'Electric Drill',     itemCode: 'ITEM-0011', warehouse: 'Gangapur Site Store',  purchaseDate: '10/01/2026', status: 'Active',    supplier: 'Bosch Tools India', warrantyExpiry: '10/01/2028', createdOn: '10/01/2026' },
  { id: 'SN-0003', item: 'Electric Drill',     itemCode: 'ITEM-0011', warehouse: 'Main Warehouse - BID', purchaseDate: '15/02/2026', status: 'In Transit', supplier: 'Bosch Tools India', warrantyExpiry: '15/02/2028', createdOn: '15/02/2026' },
  { id: 'SN-0004', item: 'Electric Drill',     itemCode: 'ITEM-0011', warehouse: 'Main Warehouse - BID', purchaseDate: '20/03/2025', status: 'Inactive',  supplier: 'Bosch Tools India', warrantyExpiry: '20/03/2027', createdOn: '20/03/2025' },
  { id: 'SN-0005', item: 'Electric Drill',     itemCode: 'ITEM-0011', warehouse: 'Nashik Road Store',    purchaseDate: '05/05/2026', status: 'Active',    supplier: 'Bosch Tools India', warrantyExpiry: '05/05/2028', createdOn: '05/05/2026' },
];

const DEMO_BATCHES = [
  { id: 'BATCH-2026-0001', item: 'Portland Cement',       itemCode: 'ITEM-0001', qty: 500, mfgDate: '01/05/2026', expiryDate: '01/11/2026', status: 'Active',  supplier: 'Shree Cement Ltd',     createdOn: '05/06/2026' },
  { id: 'BATCH-2026-0002', item: 'Paint - Exterior',       itemCode: 'ITEM-0009', qty: 200, mfgDate: '15/04/2026', expiryDate: '15/04/2028', status: 'Active',  supplier: 'Asian Paints',         createdOn: '14/06/2026' },
  { id: 'BATCH-2025-0011', item: 'Waterproofing Compound', itemCode: 'ITEM-0012', qty: 50,  mfgDate: '10/11/2025', expiryDate: '10/05/2026', status: 'Expired', supplier: 'Dr. Fixit',            createdOn: '01/12/2025' },
  { id: 'BATCH-2026-0003', item: 'Portland Cement',        itemCode: 'ITEM-0001', qty: 100, mfgDate: '05/06/2026', expiryDate: '05/12/2026', status: 'Active',  supplier: 'Shree Cement Ltd',     createdOn: '07/06/2026' },
];

const DEMO_QUALITY_INSPECTIONS = [
  {
    id: 'QI-2026-0001',
    item: 'Portland Cement',
    inspectionType: 'Inward',
    inspector: 'Suresh Kumar',
    referenceType: 'Purchase Receipt',
    referenceId: 'PRC-2026-0001',
    inspectionDate: '2026-06-06',
    status: 'Accepted',
    remarks: 'Grade 53 OPC — passed all tests',
    createdOn: '06/06/2026',
  },
  {
    id: 'QI-2026-0002',
    item: 'River Sand',
    inspectionType: 'Inward',
    inspector: 'Suresh Kumar',
    referenceType: 'Purchase Receipt',
    referenceId: 'PRC-2026-0004',
    inspectionDate: '2026-06-12',
    status: 'Rejected',
    remarks: 'High silt content, rejected and returned to supplier',
    createdOn: '12/06/2026',
  },
  {
    id: 'QI-2026-0003',
    item: 'Steel TMT Bars 12mm',
    inspectionType: 'Inward',
    inspector: 'Ramesh Singh',
    referenceType: 'Purchase Receipt',
    referenceId: 'PRC-2026-0002',
    inspectionDate: '2026-06-14',
    status: 'Accepted',
    remarks: 'Fe500D grade confirmed, test certificate verified',
    createdOn: '14/06/2026',
  },
  {
    id: 'QI-2026-0004',
    item: 'Ceramic Floor Tiles',
    inspectionType: 'Inward',
    inspector: 'Suresh Kumar',
    referenceType: 'Purchase Receipt',
    referenceId: 'PRC-2026-0003',
    inspectionDate: '2026-06-20',
    status: 'Pending',
    remarks: 'Awaiting lab test results',
    createdOn: '20/06/2026',
  },
];

// ─── Seed Function ─────────────────────────────────────────────────────────────

const seedStockDatabase = async () => {
  try {
    console.log('Syncing stock tables...');
    await sequelize.sync({ force: false, alter: true });
    console.log('Tables synced.');

    console.log('Seeding Units of Measure...');
    for (const record of DEMO_UOMS) {
      await UnitOfMeasure.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('Seeding Item Groups...');
    for (const record of DEMO_ITEM_GROUPS) {
      await ItemGroup.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('Seeding Warehouses...');
    for (const record of DEMO_WAREHOUSES) {
      await Warehouse.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('Seeding Items...');
    for (const record of DEMO_ITEMS) {
      await Item.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('Seeding Stock Entries...');
    for (const record of DEMO_STOCK_ENTRIES) {
      await StockEntry.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('Seeding Purchase Receipts...');
    for (const record of DEMO_PURCHASE_RECEIPTS) {
      await PurchaseReceipt.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('Seeding Delivery Notes...');
    for (const record of DEMO_DELIVERY_NOTES) {
      await DeliveryNote.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('Seeding Material Requests...');
    for (const record of DEMO_MATERIAL_REQUESTS) {
      await MaterialRequest.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('Seeding Pick Lists...');
    for (const record of DEMO_PICK_LISTS) {
      await PickList.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('Seeding Serial Nos...');
    for (const record of DEMO_SERIAL_NOS) {
      await SerialNo.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('Seeding Batches...');
    for (const record of DEMO_BATCHES) {
      await Batch.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('Seeding Quality Inspections...');
    for (const record of DEMO_QUALITY_INSPECTIONS) {
      await QualityInspection.findOrCreate({ where: { id: record.id }, defaults: record });
    }

    console.log('✅ Stock module seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding stock database:', error);
    process.exit(1);
  }
};

seedStockDatabase();
