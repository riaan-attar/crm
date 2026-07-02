# Database Schema Guide

This app uses Sequelize with MySQL.

## Rebuild Rules

- Database engine: MySQL-compatible
- ORM: Sequelize
- Startup behavior: `server/server.js` calls `sequelize.sync({ alter: true })` and falls back to `sequelize.sync()` if needed
- Migration files: none in this repo; the schema is defined directly in `server/models/*.model.js`
- Primary key pattern: almost every table uses `id` as `STRING` primary key
- Timestamps: most tables use Sequelize `timestamps: true`, so `createdAt` and `updatedAt` are created automatically
- Dates: the code mixes `STRING`, `DATEONLY`, and `DATE` fields, so recreate them as defined below rather than normalizing them
- Relationships: most relationships are logical/string-based references, not SQL foreign keys
- Polymorphic references: notes, tasks, and call logs use `linkedType` + `linkedId`
- JSON usage: some list fields are stored as JSON or JSON-stringified text

## Core CRM Tables

### leads
- `id` STRING PK
- `salutation` STRING default `Mr`
- `firstName` STRING required
- `lastName` STRING
- `email` STRING
- `mobileNo` STRING
- `gender` STRING
- `organization` STRING
- `website` STRING
- `noOfEmployees` STRING
- `territory` STRING
- `annualRevenue` DECIMAL(15,2)
- `industry` STRING
- `status` STRING default `New`
- `leadOwner` STRING default `Admin User`
- `leadSource` STRING
- `jobTitle` STRING
- `propertyType` STRING
- `budgetRange` STRING
- `preferredArea` STRING
- `followUpDate` DATEONLY
- `priority` STRING
- `notes` TEXT
- `assignedTo` STRING
- `createdOn` DATEONLY
- Indexes: `email`, `mobileNo`, `assignedTo`

### opportunities
- `id` STRING PK
- `title` STRING required
- `opportunityFrom` STRING
- `party` STRING
- `status` STRING default `Open`
- `amount` BIGINT
- `propertyType` STRING
- `preferredArea` STRING
- `configuration` STRING
- `budgetRange` STRING
- `source` STRING
- `expectedCloseDate` DATEONLY
- `assignedTo` STRING
- `priority` STRING
- `linkedLeadId` STRING
- `stage` STRING default `Qualification`
- `createdOn` DATEONLY
- Indexes: `linkedLeadId`, `assignedTo`

### customers
- `id` STRING PK
- `customerName` STRING required
- `customerGroup` STRING default `Individual`
- `territory` STRING
- `contactPerson` STRING
- `email` STRING
- `mobile` STRING
- `address` TEXT
- `gstin` STRING
- `panNumber` STRING
- `assignedTo` STRING
- `status` STRING default `Active`
- `totalDeals` INTEGER default `0`
- `totalValue` BIGINT default `0`
- `createdOn` DATEONLY
- Indexes: `email`, `mobile`, `assignedTo`

### contacts
- `id` STRING PK
- `firstName` STRING required
- `lastName` STRING
- `email` STRING
- `mobile` STRING
- `jobTitle` STRING
- `company` STRING
- `status` STRING default `Active`
- `source` STRING
- `createdOn` STRING

### campaigns
- `id` STRING PK
- `campaignName` STRING required
- `campaignType` STRING
- `status` STRING default `Active`
- `startDate` STRING
- `endDate` STRING
- `budget` BIGINT default `0`
- `leads` INTEGER default `0`
- `description` TEXT
- `createdOn` STRING

### contracts
- `id` STRING PK
- `partyName` STRING required
- `status` STRING default `Draft`
- `fulfilmentStatus` STRING
- `documentName` STRING

### communications
- `id` STRING PK
- `subject` STRING required
- `type` STRING
- `communicationMedium` STRING
- `status` STRING default `Open`
- `sentOrReceived` STRING

### maintenances
- `id` STRING PK
- `subject` STRING required
- `customer` STRING
- `maintenanceType` STRING
- `status` STRING default `Open`
- `priority` STRING
- `assignedTo` STRING
- `scheduledDate` STRING
- `completedDate` STRING
- `propertyUnit` STRING
- `notes` TEXT
- `createdOn` STRING

### organizations
- `id` STRING PK
- `name` STRING required
- `website` STRING
- `industry` STRING
- `territory` STRING
- `noOfEmployees` STRING
- `annualRevenue` BIGINT
- `phone` STRING
- `email` STRING
- `address` TEXT
- `description` TEXT
- `linkedContacts` JSON default `[]`
- `linkedDeals` JSON default `[]`
- `createdOn` STRING

### notes
- `id` STRING PK
- `title` STRING required
- `content` TEXT
- `linkedTo` STRING
- `linkedId` STRING
- `linkedType` STRING
- `createdBy` STRING
- `createdOn` DATEONLY
- `updatedOn` DATEONLY
- Index: `linkedType`, `linkedId`

### tasks
- `id` STRING PK
- `title` STRING required
- `description` TEXT
- `status` STRING default `Open`
- `assignedTo` STRING
- `dueDate` DATEONLY
- `priority` STRING
- `linkedTo` STRING
- `linkedId` STRING
- `linkedType` STRING
- `done` BOOLEAN default `false`
- `createdOn` DATEONLY
- Indexes: `linkedType`, `linkedId`, `assignedTo`

### call_logs
- `id` STRING PK
- `to` STRING
- `from` STRING
- `duration` STRING
- `status` STRING
- `outcome` STRING
- `notes` TEXT
- `recordingUrl` STRING
- `linkedTo` STRING
- `linkedId` STRING
- `linkedType` STRING
- `callType` STRING default `outbound`
- `createdBy` STRING
- `createdOn` DATEONLY
- Index: `linkedType`, `linkedId`

### email_templates
- `id` STRING PK
- `name` STRING required
- `subject` STRING
- `body` TEXT
- `category` STRING
- `createdBy` STRING
- `createdOn` STRING

### users
- `id` STRING PK
- `username` STRING required, unique
- `email` STRING, nullable, validated as email
- `passwordHash` STRING required
- `fullName` STRING
- `themePreference` STRING default `dark`
- Note: password is bcrypt-hashed on create

### integrations
- `id` STRING PK
- `provider` STRING required, typically `google` or `meta`
- `status` STRING default `active`
- `accountId` STRING
- `accountName` STRING
- `config` JSON default `{}`
- `userId` STRING

### oauth_accounts
- `id` STRING PK
- `provider` STRING required
- `accessToken` TEXT required
- `refreshToken` TEXT
- `expiresAt` DATE
- `profileId` STRING
- `email` STRING

### webhook_logs
- `id` STRING PK
- `provider` STRING required
- `payload` JSON required
- `status` STRING default `pending`
- `errorMessage` TEXT
- `retryCount` INTEGER default `0`

### sync_jobs
- `id` STRING PK
- `provider` STRING required
- `jobType` STRING required
- `status` STRING default `running`
- `recordsSynced` INTEGER default `0`
- `errorMessage` TEXT
- `completedAt` DATE

## Inventory and Stock Tables

### item_groups
- `id` STRING PK
- `name` STRING required
- `parentGroup` STRING
- `isGroup` BOOLEAN default `false`
- `description` TEXT
- `disabled` BOOLEAN default `false`
- `createdOn` STRING

### units_of_measure
- `id` STRING PK
- `name` STRING required
- `symbol` STRING
- `description` TEXT
- `disabled` BOOLEAN default `false`
- `createdOn` STRING

### warehouses
- `id` STRING PK
- `name` STRING required
- `warehouseType` STRING default `Stores`
- `city` STRING
- `address` TEXT
- `parentWarehouse` STRING
- `stockValue` DECIMAL(15,2) default `0`
- `isGroup` BOOLEAN default `false`
- `disabled` BOOLEAN default `false`
- `createdOn` STRING

### items
- `id` STRING PK
- `name` STRING required
- `itemGroup` STRING default `General`
- `uom` STRING default `Nos`
- `rate` DECIMAL(15,2) default `0`
- `openingStock` DECIMAL(15,3) default `0`
- `currentStock` DECIMAL(15,3) default `0`
- `reorderLevel` DECIMAL(15,3) default `0`
- `warehouse` STRING
- `description` TEXT
- `hasSerialNo` BOOLEAN default `false`
- `hasBatchNo` BOOLEAN default `false`
- `disabled` BOOLEAN default `false`
- `createdOn` STRING

### batches
- `id` STRING PK
- `item` STRING required
- `itemCode` STRING
- `qty` DECIMAL(15,3) default `0`
- `mfgDate` STRING
- `expiryDate` STRING
- `status` STRING default `Active`
- `supplier` STRING
- `description` TEXT
- `createdOn` STRING

### serial_nos
- `id` STRING PK
- `item` STRING required
- `itemCode` STRING
- `warehouse` STRING
- `purchaseDate` STRING
- `status` STRING default `Active`
- `supplier` STRING
- `warrantyExpiry` STRING
- `description` TEXT
- `createdOn` STRING

### stock_entries
- `id` STRING PK
- `stockEntryType` STRING default `Material Transfer`
- `fromWarehouse` STRING
- `toWarehouse` STRING
- `postingDate` STRING
- `totalValue` DECIMAL(15,2) default `0`
- `status` STRING default `Draft`
- `remarks` TEXT
- `items` TEXT, JSON-stringified array, default `[]`
- `createdOn` STRING

### material_requests
- `id` STRING PK
- `requestedBy` STRING required
- `purpose` STRING default `Purchase`
- `requiredDate` STRING
- `status` STRING default `Draft`
- `items` TEXT, JSON-stringified array, default `[]`
- `totalItems` INTEGER default `0`
- `remarks` TEXT
- `createdOn` STRING

### pick_lists
- `id` STRING PK
- `purpose` STRING default `Delivery`
- `warehouse` STRING
- `picker` STRING
- `date` STRING
- `status` STRING default `Draft`
- `items` TEXT, JSON-stringified array, default `[]`
- `createdOn` STRING

### purchase_receipts
- `id` STRING PK
- `supplier` STRING required
- `postingDate` STRING
- `acceptedWarehouse` STRING
- `items` TEXT, JSON-stringified array, default `[]`
- `totalQty` DECIMAL(15,3) default `0`
- `totalAmount` DECIMAL(15,2) default `0`
- `status` STRING default `Draft`
- `remarks` TEXT
- `createdOn` STRING

### delivery_notes
- `id` STRING PK
- `customer` STRING required
- `postingDate` STRING
- `fromWarehouse` STRING
- `items` TEXT, JSON-stringified array, default `[]`
- `totalQty` DECIMAL(15,3) default `0`
- `totalAmount` DECIMAL(15,2) default `0`
- `status` STRING default `Draft`
- `remarks` TEXT
- `createdOn` STRING

### quality_inspections
- `id` STRING PK
- `item` STRING required
- `inspectionType` STRING default `Inward`
- `inspector` STRING
- `referenceType` STRING
- `referenceId` STRING
- `inspectionDate` STRING
- `status` STRING default `Pending`
- `remarks` TEXT
- `createdOn` STRING

## Project and Time Tracking Tables

### projects
- `id` STRING PK
- `series` STRING default `PROJ-.####`
- `projectName` STRING required, unique
- `fromTemplate` STRING
- `company` STRING default `bootstack (Demo)`
- `status` STRING default `Open`
- `projectType` STRING
- `percentCompleteMethod` STRING default `Task Completion`
- `priority` STRING default `Medium`
- `department` STRING
- `isActive` STRING default `Yes`
- `estimatedCost` STRING
- `defaultCostCenter` STRING
- `collectProgress` BOOLEAN default `false`
- `holidayList` STRING
- `frequencyToCollectProgress` STRING default `Hourly`
- `fromTime` STRING
- `toTime` STRING
- `subject` STRING
- `message` TEXT
- `notes` TEXT
- `description` TEXT
- `expectedStartDate` STRING
- `expectedEndDate` STRING
- `actualStartDate` STRING
- `actualEndDate` STRING
- `createdOn` STRING

### project_tasks
- `id` STRING PK
- `subject` STRING required
- `project` STRING
- `isTemplate` BOOLEAN default `false`
- `issue` STRING
- `type` STRING
- `color` STRING
- `isGroup` BOOLEAN default `false`
- `status` STRING default `Open`
- `priority` STRING default `Low`
- `weight` STRING
- `parentTask` STRING
- `description` TEXT
- `dependencies` JSON default `[]`
- `company` STRING default `Bootstack IO (Demo)`
- `department` STRING
- `expectedStartDate` STRING
- `expectedEndDate` STRING
- `actualStartDate` STRING
- `actualEndDate` STRING
- `createdOn` STRING

### timesheets
- `id` STRING PK
- `series` STRING default `TS-.YYYY.-`
- `status` STRING default `Draft`
- `company` STRING default `bootstack (Demo)`
- `project` STRING
- `customer` STRING
- `currency` STRING default `INR`
- `exchangeRate` STRING default `1.000`
- `employee` STRING
- `timeSheets` JSON default `[]`
- `totalWorkingHours` DOUBLE default `0`
- `totalBillableHours` DOUBLE default `0`
- `totalBillableAmount` DOUBLE default `0`
- `totalCostingAmount` DOUBLE default `0`
- `note` TEXT
- `createdOn` STRING

## Relationship Map

- `Lead` has many `Opportunity` through `opportunities.linkedLeadId`
- `Lead`, `Opportunity`, `Customer`, and `Contact` can all own `Note`, `Task`, and `CallLog` rows via polymorphic `linkedType` + `linkedId`
- These polymorphic links are declared in Sequelize only; they are not enforced as SQL foreign keys
- `User` is the owner reference for some tables through string columns like `assignedTo`, `createdBy`, and `userId`
- Most other lookups are denormalized string references rather than FK constraints

## Practical Recreate Strategy

If you are rebuilding from scratch, the safest order is:

1. Create the MySQL database.
2. Let Sequelize sync the schema from `server/server.js` against an empty database.
3. Seed users and demo data if needed.
4. Preserve the exact column types above, especially the text-vs-date-vs-json choices.
5. Do not add foreign keys unless you also update the app, because the code currently relies on loose string references in several places.
