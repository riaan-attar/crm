CREATE DATABASE IF NOT EXISTS crm_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE crm_dev;

-- =========================================================
-- Core CRM tables
-- =========================================================

CREATE TABLE IF NOT EXISTS `leads` (
  `id` VARCHAR(255) NOT NULL,
  `salutation` VARCHAR(255) DEFAULT 'Mr',
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255),
  `email` VARCHAR(255),
  `mobileNo` VARCHAR(255),
  `gender` VARCHAR(255),
  `organization` VARCHAR(255),
  `website` VARCHAR(255),
  `noOfEmployees` VARCHAR(255),
  `territory` VARCHAR(255),
  `annualRevenue` DECIMAL(15,2),
  `industry` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'New',
  `leadOwner` VARCHAR(255) DEFAULT 'Admin User',
  `leadSource` VARCHAR(255),
  `jobTitle` VARCHAR(255),
  `propertyType` VARCHAR(255),
  `budgetRange` VARCHAR(255),
  `preferredArea` VARCHAR(255),
  `followUpDate` DATE,
  `priority` VARCHAR(255),
  `notes` TEXT,
  `assignedTo` VARCHAR(255),
  `createdOn` DATE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leads_email` (`email`),
  KEY `idx_leads_mobileNo` (`mobileNo`),
  KEY `idx_leads_assignedTo` (`assignedTo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `opportunities` (
  `id` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `opportunityFrom` VARCHAR(255),
  `party` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'Open',
  `amount` BIGINT,
  `propertyType` VARCHAR(255),
  `preferredArea` VARCHAR(255),
  `configuration` VARCHAR(255),
  `budgetRange` VARCHAR(255),
  `source` VARCHAR(255),
  `expectedCloseDate` DATE,
  `assignedTo` VARCHAR(255),
  `priority` VARCHAR(255),
  `linkedLeadId` VARCHAR(255),
  `stage` VARCHAR(255) DEFAULT 'Qualification',
  `createdOn` DATE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_opportunities_linkedLeadId` (`linkedLeadId`),
  KEY `idx_opportunities_assignedTo` (`assignedTo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `customers` (
  `id` VARCHAR(255) NOT NULL,
  `customerName` VARCHAR(255) NOT NULL,
  `customerGroup` VARCHAR(255) DEFAULT 'Individual',
  `territory` VARCHAR(255),
  `contactPerson` VARCHAR(255),
  `email` VARCHAR(255),
  `mobile` VARCHAR(255),
  `address` TEXT,
  `gstin` VARCHAR(255),
  `panNumber` VARCHAR(255),
  `assignedTo` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'Active',
  `totalDeals` INT DEFAULT 0,
  `totalValue` BIGINT DEFAULT 0,
  `createdOn` DATE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_customers_email` (`email`),
  KEY `idx_customers_mobile` (`mobile`),
  KEY `idx_customers_assignedTo` (`assignedTo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contacts` (
  `id` VARCHAR(255) NOT NULL,
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255),
  `email` VARCHAR(255),
  `mobile` VARCHAR(255),
  `jobTitle` VARCHAR(255),
  `company` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'Active',
  `source` VARCHAR(255),
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` VARCHAR(255) NOT NULL,
  `campaignName` VARCHAR(255) NOT NULL,
  `campaignType` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'Active',
  `startDate` VARCHAR(255),
  `endDate` VARCHAR(255),
  `budget` BIGINT DEFAULT 0,
  `leads` INT DEFAULT 0,
  `description` TEXT,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contracts` (
  `id` VARCHAR(255) NOT NULL,
  `partyName` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) DEFAULT 'Draft',
  `fulfilmentStatus` VARCHAR(255),
  `documentName` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `communications` (
  `id` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255),
  `communicationMedium` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'Open',
  `sentOrReceived` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `maintenances` (
  `id` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `customer` VARCHAR(255),
  `maintenanceType` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'Open',
  `priority` VARCHAR(255),
  `assignedTo` VARCHAR(255),
  `scheduledDate` VARCHAR(255),
  `completedDate` VARCHAR(255),
  `propertyUnit` VARCHAR(255),
  `notes` TEXT,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `organizations` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `website` VARCHAR(255),
  `industry` VARCHAR(255),
  `territory` VARCHAR(255),
  `noOfEmployees` VARCHAR(255),
  `annualRevenue` BIGINT,
  `phone` VARCHAR(255),
  `email` VARCHAR(255),
  `address` TEXT,
  `description` TEXT,
  `linkedContacts` JSON DEFAULT (JSON_ARRAY()),
  `linkedDeals` JSON DEFAULT (JSON_ARRAY()),
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `notes` (
  `id` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT,
  `linkedTo` VARCHAR(255),
  `linkedId` VARCHAR(255),
  `linkedType` VARCHAR(255),
  `createdBy` VARCHAR(255),
  `createdOn` DATE,
  `updatedOn` DATE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notes_linkedType_linkedId` (`linkedType`, `linkedId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` VARCHAR(255) DEFAULT 'Open',
  `assignedTo` VARCHAR(255),
  `dueDate` DATE,
  `priority` VARCHAR(255),
  `linkedTo` VARCHAR(255),
  `linkedId` VARCHAR(255),
  `linkedType` VARCHAR(255),
  `done` BOOLEAN DEFAULT FALSE,
  `createdOn` DATE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tasks_linkedType_linkedId` (`linkedType`, `linkedId`),
  KEY `idx_tasks_assignedTo` (`assignedTo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `call_logs` (
  `id` VARCHAR(255) NOT NULL,
  `to` VARCHAR(255),
  `from` VARCHAR(255),
  `duration` VARCHAR(255),
  `status` VARCHAR(255),
  `outcome` VARCHAR(255),
  `notes` TEXT,
  `recordingUrl` VARCHAR(255),
  `linkedTo` VARCHAR(255),
  `linkedId` VARCHAR(255),
  `linkedType` VARCHAR(255),
  `callType` VARCHAR(255) DEFAULT 'outbound',
  `createdBy` VARCHAR(255),
  `createdOn` DATE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_call_logs_linkedType_linkedId` (`linkedType`, `linkedId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `email_templates` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255),
  `body` TEXT,
  `category` VARCHAR(255),
  `createdBy` VARCHAR(255),
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `passwordHash` VARCHAR(255) NOT NULL,
  `fullName` VARCHAR(255),
  `themePreference` VARCHAR(255) DEFAULT 'dark',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `integrations` (
  `id` VARCHAR(255) NOT NULL,
  `provider` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) DEFAULT 'active',
  `accountId` VARCHAR(255),
  `accountName` VARCHAR(255),
  `config` JSON DEFAULT (JSON_OBJECT()),
  `userId` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `oauth_accounts` (
  `id` VARCHAR(255) NOT NULL,
  `provider` VARCHAR(255) NOT NULL,
  `accessToken` TEXT NOT NULL,
  `refreshToken` TEXT,
  `expiresAt` DATETIME,
  `profileId` VARCHAR(255),
  `email` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `webhook_logs` (
  `id` VARCHAR(255) NOT NULL,
  `provider` VARCHAR(255) NOT NULL,
  `payload` JSON NOT NULL,
  `status` VARCHAR(255) DEFAULT 'pending',
  `errorMessage` TEXT,
  `retryCount` INT DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sync_jobs` (
  `id` VARCHAR(255) NOT NULL,
  `provider` VARCHAR(255) NOT NULL,
  `jobType` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) DEFAULT 'running',
  `recordsSynced` INT DEFAULT 0,
  `errorMessage` TEXT,
  `completedAt` DATETIME,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Inventory and stock tables
-- =========================================================

CREATE TABLE IF NOT EXISTS `item_groups` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `parentGroup` VARCHAR(255),
  `isGroup` BOOLEAN DEFAULT FALSE,
  `description` TEXT,
  `disabled` BOOLEAN DEFAULT FALSE,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `units_of_measure` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `symbol` VARCHAR(255),
  `description` TEXT,
  `disabled` BOOLEAN DEFAULT FALSE,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `warehouses` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `warehouseType` VARCHAR(255) DEFAULT 'Stores',
  `city` VARCHAR(255),
  `address` TEXT,
  `parentWarehouse` VARCHAR(255),
  `stockValue` DECIMAL(15,2) DEFAULT 0,
  `isGroup` BOOLEAN DEFAULT FALSE,
  `disabled` BOOLEAN DEFAULT FALSE,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `items` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `itemGroup` VARCHAR(255) DEFAULT 'General',
  `uom` VARCHAR(255) DEFAULT 'Nos',
  `rate` DECIMAL(15,2) DEFAULT 0,
  `openingStock` DECIMAL(15,3) DEFAULT 0,
  `currentStock` DECIMAL(15,3) DEFAULT 0,
  `reorderLevel` DECIMAL(15,3) DEFAULT 0,
  `warehouse` VARCHAR(255),
  `description` TEXT,
  `hasSerialNo` BOOLEAN DEFAULT FALSE,
  `hasBatchNo` BOOLEAN DEFAULT FALSE,
  `disabled` BOOLEAN DEFAULT FALSE,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `batches` (
  `id` VARCHAR(255) NOT NULL,
  `item` VARCHAR(255) NOT NULL,
  `itemCode` VARCHAR(255),
  `qty` DECIMAL(15,3) DEFAULT 0,
  `mfgDate` VARCHAR(255),
  `expiryDate` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'Active',
  `supplier` VARCHAR(255),
  `description` TEXT,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `serial_nos` (
  `id` VARCHAR(255) NOT NULL,
  `item` VARCHAR(255) NOT NULL,
  `itemCode` VARCHAR(255),
  `warehouse` VARCHAR(255),
  `purchaseDate` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'Active',
  `supplier` VARCHAR(255),
  `warrantyExpiry` VARCHAR(255),
  `description` TEXT,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `stock_entries` (
  `id` VARCHAR(255) NOT NULL,
  `stockEntryType` VARCHAR(255) DEFAULT 'Material Transfer',
  `fromWarehouse` VARCHAR(255),
  `toWarehouse` VARCHAR(255),
  `postingDate` VARCHAR(255),
  `totalValue` DECIMAL(15,2) DEFAULT 0,
  `status` VARCHAR(255) DEFAULT 'Draft',
  `remarks` TEXT,
  `items` TEXT DEFAULT '[]',
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `material_requests` (
  `id` VARCHAR(255) NOT NULL,
  `requestedBy` VARCHAR(255) NOT NULL,
  `purpose` VARCHAR(255) DEFAULT 'Purchase',
  `requiredDate` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'Draft',
  `items` TEXT DEFAULT '[]',
  `totalItems` INT DEFAULT 0,
  `remarks` TEXT,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pick_lists` (
  `id` VARCHAR(255) NOT NULL,
  `purpose` VARCHAR(255) DEFAULT 'Delivery',
  `warehouse` VARCHAR(255),
  `picker` VARCHAR(255),
  `date` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'Draft',
  `items` TEXT DEFAULT '[]',
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `purchase_receipts` (
  `id` VARCHAR(255) NOT NULL,
  `supplier` VARCHAR(255) NOT NULL,
  `postingDate` VARCHAR(255),
  `acceptedWarehouse` VARCHAR(255),
  `items` TEXT DEFAULT '[]',
  `totalQty` DECIMAL(15,3) DEFAULT 0,
  `totalAmount` DECIMAL(15,2) DEFAULT 0,
  `status` VARCHAR(255) DEFAULT 'Draft',
  `remarks` TEXT,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `delivery_notes` (
  `id` VARCHAR(255) NOT NULL,
  `customer` VARCHAR(255) NOT NULL,
  `postingDate` VARCHAR(255),
  `fromWarehouse` VARCHAR(255),
  `items` TEXT DEFAULT '[]',
  `totalQty` DECIMAL(15,3) DEFAULT 0,
  `totalAmount` DECIMAL(15,2) DEFAULT 0,
  `status` VARCHAR(255) DEFAULT 'Draft',
  `remarks` TEXT,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `quality_inspections` (
  `id` VARCHAR(255) NOT NULL,
  `item` VARCHAR(255) NOT NULL,
  `inspectionType` VARCHAR(255) DEFAULT 'Inward',
  `inspector` VARCHAR(255),
  `referenceType` VARCHAR(255),
  `referenceId` VARCHAR(255),
  `inspectionDate` VARCHAR(255),
  `status` VARCHAR(255) DEFAULT 'Pending',
  `remarks` TEXT,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Project and time tracking tables
-- =========================================================

CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(255) NOT NULL,
  `series` VARCHAR(255) DEFAULT 'PROJ-.####',
  `projectName` VARCHAR(255) NOT NULL,
  `fromTemplate` VARCHAR(255),
  `company` VARCHAR(255) DEFAULT 'bootstack (Demo)',
  `status` VARCHAR(255) DEFAULT 'Open',
  `projectType` VARCHAR(255),
  `percentCompleteMethod` VARCHAR(255) DEFAULT 'Task Completion',
  `priority` VARCHAR(255) DEFAULT 'Medium',
  `department` VARCHAR(255),
  `isActive` VARCHAR(255) DEFAULT 'Yes',
  `estimatedCost` VARCHAR(255),
  `defaultCostCenter` VARCHAR(255),
  `collectProgress` BOOLEAN DEFAULT FALSE,
  `holidayList` VARCHAR(255),
  `frequencyToCollectProgress` VARCHAR(255) DEFAULT 'Hourly',
  `fromTime` VARCHAR(255),
  `toTime` VARCHAR(255),
  `subject` VARCHAR(255),
  `message` TEXT,
  `notes` TEXT,
  `description` TEXT,
  `expectedStartDate` VARCHAR(255),
  `expectedEndDate` VARCHAR(255),
  `actualStartDate` VARCHAR(255),
  `actualEndDate` VARCHAR(255),
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_projects_projectName` (`projectName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `project_tasks` (
  `id` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `project` VARCHAR(255),
  `isTemplate` BOOLEAN DEFAULT FALSE,
  `issue` VARCHAR(255),
  `type` VARCHAR(255),
  `color` VARCHAR(255),
  `isGroup` BOOLEAN DEFAULT FALSE,
  `status` VARCHAR(255) DEFAULT 'Open',
  `priority` VARCHAR(255) DEFAULT 'Low',
  `weight` VARCHAR(255),
  `parentTask` VARCHAR(255),
  `description` TEXT,
  `dependencies` JSON DEFAULT (JSON_ARRAY()),
  `company` VARCHAR(255) DEFAULT 'Bootstack IO (Demo)',
  `department` VARCHAR(255),
  `expectedStartDate` VARCHAR(255),
  `expectedEndDate` VARCHAR(255),
  `actualStartDate` VARCHAR(255),
  `actualEndDate` VARCHAR(255),
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `timesheets` (
  `id` VARCHAR(255) NOT NULL,
  `series` VARCHAR(255) DEFAULT 'TS-.YYYY.-',
  `status` VARCHAR(255) DEFAULT 'Draft',
  `company` VARCHAR(255) DEFAULT 'bootstack (Demo)',
  `project` VARCHAR(255),
  `customer` VARCHAR(255),
  `currency` VARCHAR(255) DEFAULT 'INR',
  `exchangeRate` VARCHAR(255) DEFAULT '1.000',
  `employee` VARCHAR(255),
  `timeSheets` JSON DEFAULT (JSON_ARRAY()),
  `totalWorkingHours` DOUBLE DEFAULT 0,
  `totalBillableHours` DOUBLE DEFAULT 0,
  `totalBillableAmount` DOUBLE DEFAULT 0,
  `totalCostingAmount` DOUBLE DEFAULT 0,
  `note` TEXT,
  `createdOn` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
