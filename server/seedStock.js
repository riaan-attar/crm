const { sequelize, Warehouse, Item, ItemGroup, UnitOfMeasure, SerialNo, Batch, QualityInspection, StockEntry } = require('./models');

const generateData = async () => {
  try {
    await sequelize.sync(); // ensure tables exist

    console.log('Clearing existing data...');
    await Warehouse.destroy({ where: {} });
    await Item.destroy({ where: {} });
    await ItemGroup.destroy({ where: {} });
    await UnitOfMeasure.destroy({ where: {} });
    await SerialNo.destroy({ where: {} });
    await Batch.destroy({ where: {} });
    await QualityInspection.destroy({ where: {} });
    await StockEntry.destroy({ where: {} });

    const createdOn = new Date().toLocaleDateString('en-IN');

    console.log('Seeding UnitOfMeasures...');
    const uoms = [
      { id: 'UOM-0001', name: 'Nos', symbol: 'Nos', createdOn },
      { id: 'UOM-0002', name: 'Kg', symbol: 'kg', createdOn },
      { id: 'UOM-0003', name: 'Meter', symbol: 'm', createdOn },
      { id: 'UOM-0004', name: 'Liters', symbol: 'L', createdOn }
    ];
    await UnitOfMeasure.bulkCreate(uoms);

    console.log('Seeding ItemGroups...');
    const groups = [
      { id: 'IG-0001', name: 'Raw Material', isGroup: false, createdOn },
      { id: 'IG-0002', name: 'Finished Goods', isGroup: false, createdOn },
      { id: 'IG-0003', name: 'Hardware', isGroup: false, createdOn },
      { id: 'IG-0004', name: 'Consumables', isGroup: false, createdOn }
    ];
    await ItemGroup.bulkCreate(groups);

    console.log('Seeding Warehouses...');
    const warehouses = [
      { id: 'WH-0001', name: 'Main Warehouse - BID', city: 'Mumbai', stockValue: 2150000, createdOn },
      { id: 'WH-0002', name: 'Gangapur Site Store', city: 'Nashik', stockValue: 980000, createdOn },
      { id: 'WH-0003', name: 'Nashik Road Store', city: 'Nashik', stockValue: 620000, createdOn },
      { id: 'WH-0004', name: 'Satpur Factory', city: 'Nashik', stockValue: 340000, createdOn }
    ];
    await Warehouse.bulkCreate(warehouses);

    console.log('Seeding Items...');
    const items = [
      { id: 'ITEM-0001', name: 'Electric Drill', itemGroup: 'Hardware', uom: 'Nos', rate: 4500, openingStock: 50, currentStock: 45, warehouse: 'Main Warehouse - BID', hasSerialNo: true, createdOn },
      { id: 'ITEM-0002', name: 'Concrete Mixer', itemGroup: 'Hardware', uom: 'Nos', rate: 120000, openingStock: 5, currentStock: 5, warehouse: 'Gangapur Site Store', hasSerialNo: true, createdOn },
      { id: 'ITEM-0003', name: 'Steel Rods (12mm)', itemGroup: 'Raw Material', uom: 'Kg', rate: 65, openingStock: 5000, currentStock: 4800, warehouse: 'Nashik Road Store', hasBatchNo: true, createdOn },
      { id: 'ITEM-0004', name: 'Cement Bag (50kg)', itemGroup: 'Raw Material', uom: 'Nos', rate: 350, openingStock: 1000, currentStock: 850, warehouse: 'Satpur Factory', hasBatchNo: true, createdOn },
      { id: 'ITEM-0005', name: 'Safety Helmet', itemGroup: 'Consumables', uom: 'Nos', rate: 250, openingStock: 200, currentStock: 180, warehouse: 'Main Warehouse - BID', createdOn }
    ];
    await Item.bulkCreate(items);

    console.log('Seeding SerialNos...');
    const serialNos = [
      { id: 'SN-0001', item: 'Electric Drill', itemCode: 'ITEM-0001', warehouse: 'Main Warehouse - BID', purchaseDate: '10/01/2026', status: 'Active', createdOn },
      { id: 'SN-0002', item: 'Concrete Mixer', itemCode: 'ITEM-0002', warehouse: 'Gangapur Site Store', purchaseDate: '15/02/2026', status: 'In Transit', createdOn },
      { id: 'SN-0003', item: 'Electric Drill', itemCode: 'ITEM-0001', warehouse: 'Main Warehouse - BID', purchaseDate: '20/03/2026', status: 'Inactive', createdOn }
    ];
    await SerialNo.bulkCreate(serialNos);

    console.log('Seeding Batches...');
    const batches = [
      { id: 'BATCH-0001', item: 'Steel Rods (12mm)', itemCode: 'ITEM-0003', qty: 5000, manufacturingDate: '01/01/2026', expiryDate: '31/12/2030', status: 'Active', createdOn },
      { id: 'BATCH-0002', item: 'Cement Bag (50kg)', itemCode: 'ITEM-0004', qty: 1000, manufacturingDate: '15/02/2026', expiryDate: '15/05/2026', status: 'Quarantine', createdOn }
    ];
    await Batch.bulkCreate(batches);

    console.log('Seeding Quality Inspections...');
    const qis = [
      { id: 'QI-0001', item: 'Cement Bag (50kg)', itemCode: 'ITEM-0004', referenceType: 'Purchase Receipt', referenceName: 'PR-0001', status: 'Accepted', inspector: 'John Doe', inspectionDate: '20/02/2026', createdOn },
      { id: 'QI-0002', item: 'Steel Rods (12mm)', itemCode: 'ITEM-0003', referenceType: 'Material Receipt', referenceName: 'MR-0002', status: 'Pending', inspector: 'Jane Smith', inspectionDate: '25/02/2026', createdOn }
    ];
    await QualityInspection.bulkCreate(qis);

    console.log('Seeding StockEntries...');
    const stockEntries = [
      { id: 'STE-0001', stockEntryType: 'Material Receipt', fromWarehouse: '—', toWarehouse: 'Main Warehouse - BID', totalValue: 450000, postingDate: '10/06/2026', status: 'Submitted', createdOn },
      { id: 'STE-0002', stockEntryType: 'Material Transfer', fromWarehouse: 'Main Warehouse - BID', toWarehouse: 'Gangapur Site Store', totalValue: 12500, postingDate: '12/06/2026', status: 'Draft', createdOn },
      { id: 'STE-0003', stockEntryType: 'Material Issue', fromWarehouse: 'Satpur Factory', toWarehouse: '—', totalValue: 35000, postingDate: '15/06/2026', status: 'Submitted', createdOn }
    ];
    await StockEntry.bulkCreate(stockEntries);

    console.log('Data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

generateData();
