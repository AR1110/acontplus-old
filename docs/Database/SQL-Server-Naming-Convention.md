# SQL Server Naming Convention Guide - Ecuador ERP

## Table of Contents

- [Introduction](#introduction)
- [General Principles](#general-principles)
- [Database Objects](#database-objects)
  - [Tables](#tables)
  - [Columns](#columns)
  - [Primary Keys](#primary-keys)
  - [Foreign Keys](#foreign-keys)
  - [Indexes](#indexes)
  - [Constraints](#constraints)
  - [Views](#views)
  - [Stored Procedures](#stored-procedures)
  - [Functions](#functions)
  - [Triggers](#triggers)
  - [Sequences](#sequences)
  - [Synonyms](#synonyms)
  - [User-Defined Table Types](#user-defined-table-types)
  - [Temporary Objects](#temporary-objects)
  - [Junction Tables](#junction-tables)
  - [Audit & History Tables](#audit--history-tables)
- [Parameters & Variables](#parameters--variables)
- [Ecuador-Specific Conventions](#ecuador-specific-conventions)
- [Security Objects](#security-objects)
- [Migration Scripts](#migration-scripts)
- [Schemas](#schemas)
- [Data Types](#data-types)
- [Naming Examples](#naming-examples)
- [Best Practices](#best-practices)

---

## Introduction

This document establishes the naming conventions for SQL Server database objects in the Ecuador ERP system. Following these standards ensures consistency, maintainability, and clarity across the entire database architecture.

### Objectives

- **Consistency**: All database objects follow the same naming patterns
- **Clarity**: Names are self-documenting and easy to understand
- **Maintainability**: Facilitates long-term maintenance and updates
- **Collaboration**: Enables effective teamwork across development teams

---

## General Principles

### 1. Language

- Use **English** for all database object names
- Exception: Business-specific terms from Ecuador that have no direct English translation

### 2. Character Set

- Use only alphanumeric characters (A-Z, a-z, 0-9)
- Use underscores (\_) as word separators
- Avoid special characters, spaces, or accented letters

### 3. Case Convention

- Use **PascalCase** for table and column names
- Use **PascalCase** for stored procedures, functions, and views
- Avoid ALL CAPS except for abbreviations (ID, SRI, RUC)

### 4. Abbreviations

- Minimize abbreviations
- Use only well-known abbreviations (ID, Num, Qty, Amt)
- Document custom abbreviations in a glossary

### 5. Prefixes and Suffixes

- Avoid Hungarian notation
- Use prefixes for stored procedures and functions to indicate type
- Use descriptive suffixes when necessary (Date, Time, Status, Type)

### 6. Multi-Entity Schemas

When a schema contains **multiple entities** (e.g., `Purchases` contains `Supplier`, `PurchaseInvoice`, `PurchaseOrder`), always include the entity name in object names to avoid ambiguity:

```sql
-- ✅ Good: Clear entity context in multi-entity schema
Purchases.SupplierGetById
Purchases.SupplierCreate
Purchases.PurchaseInvoiceGetById
Purchases.PurchaseOrderApprove

-- ❌ Bad: Ambiguous in multi-entity schema
Purchases.GetById  -- Which entity?
Purchases.Create   -- Create what?
```

**When to include entity names:**

- **Always** include entity name when schema has 2+ main entities
- **Optional** when schema represents a single entity/concept
- **Required** for views, stored procedures, functions, and triggers

**Examples of multi-entity schemas:**

- `Purchases`: Supplier, PurchaseInvoice, PurchaseOrder
- `Restaurant`: Table, Order, MenuItem, Reservation
- `Common`: Company, User, Address, Parameter
- `Inventory`: Product, Warehouse, StockMovement

---

## Database Objects

### Tables

#### Naming Pattern

```
[Schema].[EntityName]
```

#### Rules

- Singular noun (e.g., `Order`, not `Orders`)
- PascalCase format
- No prefix (avoid `tbl`, `TB_`, etc.)
- Descriptive and business-oriented

#### Examples

```sql
Sales.Order
Sales.OrderDetail
Inventory.Product
Common.Company
Restaurant.Table
Accounting.JournalEntry
```

#### Reserved Words

If a table name conflicts with SQL Server reserved words, use brackets:

```sql
Restaurant.[Table]
Restaurant.[Order]
```

---

### Columns

#### Naming Pattern

```
[DescriptiveName]
```

#### Rules

- PascalCase format
- No prefix indicating data type
- Descriptive and self-explanatory
- Use complete words (avoid abbreviations)

#### Standard Columns

Every table should include these audit columns:

```sql
Id                 BIGINT IDENTITY(1,1) PRIMARY KEY
CreatedAt          DATETIME2(7) NOT NULL DEFAULT GETUTCDATE()
CreatedBy          BIGINT NULL
UpdatedAt          DATETIME2(7) NULL
UpdatedBy          BIGINT NULL
IsDeleted          BIT NOT NULL DEFAULT 0
DeletedAt          DATETIME2(7) NULL
DeletedBy          BIGINT NULL
```

#### Examples

```sql
-- Good
ProductName
UnitPrice
QuantityInStock
CustomerEmail
OrderDate
TaxAmount

-- Bad (avoid)
prod_name
unit_price
qty_stock
cust_email
ord_dt
tax_amt
```

#### Boolean Columns

Use `Is` or `Has` prefix:

```sql
IsActive
IsDeleted
HasDiscount
IsProcessed
```

#### Date/Time Columns

Use descriptive suffixes:

```sql
CreatedAt
UpdatedAt
DeletedAt
StartDate
EndDate
DueDate
ProcessedAt
```

---

### Primary Keys

#### Naming Pattern

```
PK_[TableName]_[ColumnName]
```

#### Rules

- Always use `Id` as the primary key column name
- Use `BIGINT IDENTITY(1,1)` for auto-increment
- Single column primary key preferred

#### Examples

```sql
-- Table: Sales.Order
CONSTRAINT PK_Order_Id PRIMARY KEY (Id)

-- Table: Inventory.Product
CONSTRAINT PK_Product_Id PRIMARY KEY (Id)
```

---

### Foreign Keys

#### Naming Pattern

```
FK_[ChildTable]_[ParentTable]_[ColumnName]
```

#### Rules

- Foreign key column name: `[ParentTable]Id`
- Use `BIGINT` to match primary key type
- Include `ON DELETE` and `ON UPDATE` rules when appropriate

#### Examples

```sql
-- Table: Sales.OrderDetail
OrderId BIGINT NOT NULL
CONSTRAINT FK_OrderDetail_Order_OrderId
    FOREIGN KEY (OrderId)
    REFERENCES Sales.Order(Id)

-- Table: Restaurant.Order
CustomerId BIGINT NULL
CONSTRAINT FK_Order_Customer_CustomerId
    FOREIGN KEY (CustomerId)
    REFERENCES Common.Company(Id)
```

#### Composite Foreign Keys

```sql
CONSTRAINT FK_OrderItem_Order_OrderId_LineNumber
    FOREIGN KEY (OrderId, LineNumber)
    REFERENCES Sales.Order(Id, LineNumber)
```

---

### Indexes

#### Naming Pattern

```
IX_[TableName]_[Column1]_[Column2]_[...]
```

For unique indexes:

```
UIX_[TableName]_[Column1]_[Column2]_[...]
```

#### Rules

- Use `IX_` prefix for non-clustered indexes
- Use `UIX_` prefix for unique indexes
- List columns in the order they appear in the index
- Include `INCLUDE` columns in the name if critical

#### Examples

```sql
-- Non-clustered index
CREATE NONCLUSTERED INDEX IX_Order_CustomerId_OrderDate
ON Sales.Order (CustomerId, OrderDate)

-- Unique index
CREATE UNIQUE INDEX UIX_Product_SKU
ON Inventory.Product (SKU)
WHERE IsDeleted = 0

-- Covering index
CREATE NONCLUSTERED INDEX IX_Order_CustomerId_INCL_Total
ON Sales.Order (CustomerId)
INCLUDE (Total, OrderDate)
```

---

### Constraints

#### Check Constraints

```
CK_[TableName]_[ColumnName]_[Description]
```

Examples:

```sql
CONSTRAINT CK_Order_Total_Positive
    CHECK (Total >= 0)

CONSTRAINT CK_Product_Quantity_NonNegative
    CHECK (Quantity >= 0)

CONSTRAINT CK_Employee_Email_Format
    CHECK (Email LIKE '%@%.%')
```

#### Default Constraints

```
DF_[TableName]_[ColumnName]
```

Examples:

```sql
CONSTRAINT DF_Order_CreatedAt
    DEFAULT GETUTCDATE()

CONSTRAINT DF_Product_IsActive
    DEFAULT 1

CONSTRAINT DF_Order_Status
    DEFAULT 'Pending'
```

#### Unique Constraints

```
UQ_[TableName]_[Column1]_[Column2]_[...]
```

Examples:

```sql
CONSTRAINT UQ_User_Email
    UNIQUE (Email)

CONSTRAINT UQ_Product_CompanyId_SKU
    UNIQUE (CompanyId, SKU)
```

---

### Views

#### Naming Pattern

```
[Schema].[EntityName]View
OR
[Schema].[DescriptiveName]View
```

#### Rules

- Suffix with `View`
- PascalCase format
- **Include entity name** when schema has multiple entities
- Descriptive of the data returned
- No `v` or `vw` prefix

#### Examples

```sql
-- Multi-entity schemas: Include entity name
Inventory.ProductStockView           -- Inventory has: Product, Warehouse, Movement
Inventory.WarehouseCapacityView
Restaurant.TableAvailabilityView     -- Restaurant has: Table, Order, MenuItem
Restaurant.OrderSummaryView
Purchases.SupplierPerformanceView    -- Purchases has: Supplier, Invoice, Order
Purchases.PurchaseInvoiceStatusView

-- Single-entity or aggregate views
Accounting.MonthlyRevenueView        -- Aggregate across multiple entities
Sales.TopCustomersView               -- Reporting/analytics view

-- Security views
Common.UserPermissionsView
Sales.CustomerContactView
```

---

### Stored Procedures

#### Naming Pattern

```
[Schema].[Entity][Action][Detail]
```

#### Actions

- `Get` - Retrieve single record
- `Find` - Retrieve multiple records
- `Create` - Insert new record
- `Update` - Modify existing record
- `Delete` - Remove record (soft delete)
- `Process` - Business logic operation
- `Calculate` - Computation operation
- `Validate` - Validation operation
- `BulkInsert` - Bulk insert operations
- `BulkUpdate` - Bulk update operations
- `BulkDelete` - Bulk delete operations
- `Archive` - Archive old data
- `Cleanup` - Maintenance/cleanup operations
- `Sync` - Synchronization operations

#### Statistics Procedures (Special Pattern)

```
[Schema].StatisticsGet[Type]
```

#### Rules

- PascalCase format
- **Always include entity name** when schema has multiple entities
- Entity name first, then action, then optional detail
- No `sp_` prefix (reserved for system)
- No `usp_` or `proc_` prefix
- Use descriptive action verbs
- Omit entity only for cross-entity operations or when schema represents a single concept

#### Examples

**CRUD Operations (Multi-Entity Schemas):**

```sql
-- Get single record - Entity name included
Sales.OrderGetById
Inventory.ProductGetBySKU
Restaurant.TableGetByNumber
Purchases.SupplierGetById              -- Purchases has multiple entities
Purchases.PurchaseInvoiceGetById       -- Clear which entity
Purchases.PurchaseOrderGetById

-- Find multiple records - Entity name included
Sales.OrderFindByCustomer
Sales.OrderFindByDateRange
Inventory.ProductFindByCategory
Inventory.WarehouseFindByRegion        -- Inventory has multiple entities
Purchases.SupplierFindByCountry
Purchases.PurchaseInvoiceFindByStatus

-- Create - Entity name included
Sales.OrderCreate
Sales.OrderCreateWithItems
Inventory.ProductCreate
Restaurant.ReservationCreate           -- Restaurant has multiple entities
Restaurant.MenuItemCreate

-- Update - Entity name included
Sales.OrderUpdate
Sales.OrderUpdateStatus
Inventory.ProductUpdatePrice
Purchases.SupplierUpdateContact
Purchases.PurchaseOrderUpdateStatus

-- Delete (soft delete) - Entity name included
Sales.OrderDelete
Inventory.ProductDelete
Restaurant.ReservationDelete
```

**Business Logic:**

```sql
Sales.OrderProcessPayment
Sales.OrderProcessRefund
Sales.OrderCalculateTotal
Inventory.ProductCalculateReorderPoint
Restaurant.OrderProcessKitchen
Accounting.JournalEntryPost
```

**Statistics/Analytics:**

```sql
Restaurant.StatisticsGetDashboard
Restaurant.StatisticsGetRealTime
Restaurant.StatisticsGetAggregated
Restaurant.StatisticsGetTrends
Sales.StatisticsGetDashboard
Inventory.StatisticsGetMovement
```

**Validation:**

```sql
Sales.OrderValidateStock
Inventory.ProductValidateQuantity
Restaurant.TableValidateAvailability
```

**Bulk Operations:**

```sql
-- Bulk inserts
Sales.OrderBulkInsert
Inventory.ProductBulkInsert
Purchases.PurchaseInvoiceBulkCreate

-- Bulk updates
Inventory.ProductPriceBulkUpdate
Sales.OrderStatusBulkUpdate

-- Bulk deletes
Inventory.ProductBulkDelete
Sales.OrderBulkCancel
```

**Maintenance & Operations:**

```sql
-- Archive operations
Sales.OrderArchiveOld
Accounting.JournalEntryArchiveByYear

-- Cleanup operations
Common.LogCleanupOld
Sales.OrderCleanupCancelled

-- Synchronization
Inventory.ProductSyncFromExternal
Sales.CustomerSyncToERP
```

**Cross-Schema Operations:**

```sql
-- When procedure in one schema operates on multiple schemas
-- Use the primary/initiating schema
Sales.OrderProcessWithInventory      -- Sales initiates, affects Inventory
Purchases.ReceiveAndUpdateInventory  -- Purchases initiates, affects Inventory
Restaurant.OrderProcessAndBill       -- Restaurant initiates, affects Sales
```

---

### Functions

#### Naming Pattern

```
[Schema].[fn][Entity][DescriptiveName]   -- For multi-entity schemas
[Schema].[fn][DescriptiveName]          -- For single-entity or utility schemas
```

#### Types and Prefixes

- Scalar functions: `fn`
- Table-valued functions: `fn` or `tvf`
- Inline table-valued: `fn` or `itvf`

#### Rules

- PascalCase after prefix
- **Include entity name** when schema has multiple entities
- Descriptive of return value
- Use verb or noun depending on function type

#### Examples

**Scalar Functions:**

```sql
-- Utility functions (no entity needed)
Common.fnCalculateTax
Common.fnGetBusinessDays
Accounting.fnGetFiscalYear

-- Multi-entity schema: Include entity
Sales.fnOrderCalculateDiscount         -- Sales may have Order, Quote, Invoice
Restaurant.fnOrderCalculateTotal       -- Restaurant has Order, Table, etc.
Inventory.fnProductCalculateReorderPoint
Purchases.fnSupplierGetCreditLimit
```

**Table-Valued Functions:**

```sql
-- Multi-entity schemas: Include entity
Sales.fnOrderGetByDateRange
Inventory.fnProductGetLowStock
Inventory.fnWarehouseGetCapacity
Restaurant.fnOrderGetActive
Restaurant.fnTableGetAvailable
Purchases.fnSupplierGetByRating
Purchases.fnPurchaseInvoiceGetPending

-- Utility functions
Common.fnSplitString
Common.fnGetDateRange
```

**Inline Table-Valued Functions:**

```sql
-- Multi-entity schemas: Include entity
Sales.fnOrderDetailsByOrderId
Inventory.fnProductsByCategory
Inventory.fnStockMovementByWarehouse
Restaurant.fnTablesByStatus
Restaurant.fnReservationsByDate
Purchases.fnPurchaseOrdersBySupplier
```

---

### Triggers

#### Naming Pattern

```
[Schema].[TR_][TableName]_[Action]_[Description]
```

#### Actions

- `AI` - After Insert
- `AU` - After Update
- `AD` - After Delete
- `IIO` - Instead Of Insert
- `IUO` - Instead Of Update
- `IDO` - Instead Of Delete

#### Rules

- `TR_` prefix
- **Full table name** (which already includes entity context)
- Action abbreviation
- Brief description
- Table name naturally disambiguates in multi-entity schemas

#### Examples

```sql
-- Multi-entity schemas: Table name provides entity context
Sales.TR_Order_AU_UpdateTimestamp
Sales.TR_OrderDetail_AI_ValidateStock
Inventory.TR_Product_AU_AuditLog
Inventory.TR_Warehouse_AI_InitializeStock
Inventory.TR_StockMovement_AI_UpdateInventory
Restaurant.TR_Order_AD_PreventDelete
Restaurant.TR_Table_AU_TrackChanges
Restaurant.TR_Reservation_AI_ValidateAvailability
Purchases.TR_Supplier_AU_LogChanges
Purchases.TR_PurchaseInvoice_AI_ValidateTerms
Accounting.TR_JournalEntry_IIO_Validate
```

---

### Sequences

#### Naming Pattern

```
[Schema].[SEQ_][EntityName]_[Purpose]
```

#### Rules

- `SEQ_` prefix
- PascalCase format
- Entity name followed by purpose
- Used for custom ID generation

#### Examples

```sql
-- Document number sequences
Sales.SEQ_Invoice_Number
Sales.SEQ_Order_Number
Purchases.SEQ_PurchaseOrder_Number

-- Custom ID sequences
Restaurant.SEQ_Table_Number
Common.SEQ_Company_Code

-- Batch/Transaction sequences
Accounting.SEQ_JournalEntry_Batch
Inventory.SEQ_StockMovement_Batch
```

#### Implementation Example

```sql
CREATE SEQUENCE Sales.SEQ_Invoice_Number
    AS BIGINT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9999999999
    NO CYCLE
    CACHE 50;
GO
```

---

### Synonyms

#### Naming Pattern

```
[Schema].[SYN_][TargetObjectName]
```

#### Rules

- `SYN_` prefix
- PascalCase format
- Reflect the target object name
- Use for cross-database or linked server references

#### Examples

```sql
-- Cross-database synonyms
CREATE SYNONYM Sales.SYN_Customer
    FOR ExternalDB.dbo.Customer;

CREATE SYNONYM Inventory.SYN_ProductCatalog
    FOR CatalogDB.Inventory.Product;

-- Linked server synonyms
CREATE SYNONYM Common.SYN_ExternalCompany
    FOR LinkedServer.CompanyDB.dbo.Company;
```

---

### User-Defined Table Types

#### Naming Pattern

```
[Schema].[TVP_][EntityName][Purpose]
```

#### Rules

- `TVP_` prefix (Table-Valued Parameter)
- PascalCase format
- Entity name followed by purpose
- Used for passing table data to stored procedures

#### Examples

```sql
-- Basic table types
Sales.TVP_OrderDetailList
Inventory.TVP_ProductIdList
Common.TVP_CompanyIdList

-- Import/Bulk operation types
Sales.TVP_OrderBulkImport
Inventory.TVP_StockAdjustmentList
Accounting.TVP_JournalEntryLineList
```

#### Implementation Example

```sql
CREATE TYPE Sales.TVP_OrderDetailList AS TABLE
(
    ProductId BIGINT NOT NULL,
    Quantity DECIMAL(18,4) NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    DiscountPercent DECIMAL(5,2) NULL,
    PRIMARY KEY (ProductId)
);
GO

-- Usage in stored procedure
CREATE PROCEDURE Sales.OrderCreateWithDetails
    @CustomerId BIGINT,
    @OrderDate DATE,
    @OrderDetails Sales.TVP_OrderDetailList READONLY
AS
BEGIN
    -- Implementation
END;
GO
```

---

### Temporary Objects

#### Naming Pattern

**Local Temporary Tables:**

```
#[EntityName][Purpose]
```

**Global Temporary Tables:**

```
##[EntityName][Purpose]
```

**Table Variables:**

```
@[EntityName][Purpose]
```

#### Rules

- PascalCase after prefix
- Descriptive purpose
- Keep scope minimal
- Clean up explicitly when possible

#### Examples

```sql
-- Local temporary tables (session-scoped)
CREATE TABLE #OrderCalculation
(
    OrderId BIGINT,
    Total DECIMAL(18,2)
);

CREATE TABLE #ProductBatch
(
    ProductId BIGINT,
    Quantity INT
);

-- Table variables (procedure-scoped)
DECLARE @OrderItems TABLE
(
    LineNumber INT,
    ProductId BIGINT,
    Quantity DECIMAL(18,4)
);

DECLARE @ValidationResults TABLE
(
    ErrorCode INT,
    ErrorMessage NVARCHAR(255)
);

-- Global temporary tables (rare, cross-session)
CREATE TABLE ##SystemConfiguration
(
    ConfigKey NVARCHAR(100),
    ConfigValue NVARCHAR(MAX)
);
```

---

### Junction Tables

#### Naming Pattern

```
[Schema].[Entity1][Entity2]
```

#### Rules

- No "Mapping" or "Link" suffix
- Alphabetical order when both entities are equal importance
- Primary entity first when there's hierarchy
- PascalCase format
- Singular entity names

#### Examples

```sql
-- Many-to-many relationships
Sales.OrderProduct                    -- Orders can have many Products
Inventory.ProductWarehouse            -- Products in multiple Warehouses
Common.UserRole                       -- Users with multiple Roles
Restaurant.MenuItemIngredient         -- MenuItems contain Ingredients

-- With schema context
Purchases.SupplierProduct             -- Suppliers supply Products
Accounting.AccountDepartment          -- Accounts assigned to Departments
Vet.PetService                        -- Pets receive Services

-- Complex junction with additional data
Sales.OrderProductDiscount            -- When discount is order-product specific
Restaurant.ReservationTable           -- Reservations can span multiple tables
```

#### Implementation Example

```sql
CREATE TABLE Sales.OrderProduct
(
    Id BIGINT IDENTITY(1,1) NOT NULL,
    OrderId BIGINT NOT NULL,
    ProductId BIGINT NOT NULL,

    -- Junction-specific data
    Quantity DECIMAL(18,4) NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    DiscountPercent DECIMAL(5,2) NOT NULL DEFAULT 0,
    LineNumber INT NOT NULL,

    -- Audit
    CreatedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy BIGINT NULL,

    CONSTRAINT PK_OrderProduct_Id PRIMARY KEY (Id),
    CONSTRAINT FK_OrderProduct_Order_OrderId
        FOREIGN KEY (OrderId) REFERENCES Sales.Order(Id),
    CONSTRAINT FK_OrderProduct_Product_ProductId
        FOREIGN KEY (ProductId) REFERENCES Inventory.Product(Id),
    CONSTRAINT UQ_OrderProduct_OrderId_ProductId
        UNIQUE (OrderId, ProductId)
);
```

---

### Audit & History Tables

#### Naming Pattern

```
[Schema].[EntityName]History
```

#### Rules

- Suffix with `History`
- Mirror the structure of the original table
- Include `HistoryAction` column (INSERT, UPDATE, DELETE)
- Include `HistoryDate` timestamp
- PascalCase format

#### Examples

```sql
-- Audit tables
Sales.OrderHistory
Inventory.ProductHistory
Accounting.JournalEntryHistory
Restaurant.ReservationHistory
Purchases.SupplierHistory

-- Price history tables
Inventory.ProductPriceHistory
Sales.CustomerPriceHistory
```

#### Implementation Example

```sql
CREATE TABLE Sales.OrderHistory
(
    HistoryId BIGINT IDENTITY(1,1) NOT NULL,
    HistoryAction NVARCHAR(10) NOT NULL,  -- INSERT, UPDATE, DELETE
    HistoryDate DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    HistoryBy BIGINT NULL,

    -- Original table columns
    Id BIGINT NOT NULL,
    CustomerId BIGINT NOT NULL,
    OrderNumber NVARCHAR(50) NOT NULL,
    OrderDate DATE NOT NULL,
    Status TINYINT NOT NULL,
    Total DECIMAL(18,2) NOT NULL,

    -- Original audit fields
    CreatedAt DATETIME2(7) NOT NULL,
    CreatedBy BIGINT NULL,
    UpdatedAt DATETIME2(7) NULL,
    UpdatedBy BIGINT NULL,

    CONSTRAINT PK_OrderHistory_HistoryId PRIMARY KEY (HistoryId)
);
GO

-- Trigger to populate history
CREATE TRIGGER Sales.TR_Order_AU_RecordHistory
ON Sales.Order
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Sales.OrderHistory
    (HistoryAction, HistoryBy, Id, CustomerId, OrderNumber,
     OrderDate, Status, Total, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy)
    SELECT
        'UPDATE',
        CAST(SESSION_CONTEXT(N'UserId') AS BIGINT),
        Id, CustomerId, OrderNumber, OrderDate, Status, Total,
        CreatedAt, CreatedBy, UpdatedAt, UpdatedBy
    FROM deleted;
END;
GO
```

---

## Parameters & Variables

### Stored Procedure Parameters

#### Naming Pattern

```
@[EntityName][PropertyName]
@[PropertyName]  -- For single-entity context
```

#### Rules

- Always start with `@`
- PascalCase format
- Include entity name for clarity in multi-entity procedures
- Use `@Output` suffix for output parameters
- Use descriptive names, not abbreviations

#### Examples

```sql
-- Input parameters
CREATE PROCEDURE Sales.OrderCreate
    @CustomerId BIGINT,
    @OrderDate DATE = NULL,
    @EstablishmentId BIGINT,
    @Notes NVARCHAR(MAX) = NULL,
    @OrderDetails Sales.TVP_OrderDetailList READONLY
AS BEGIN
    -- Implementation
END;
GO

-- Output parameters
CREATE PROCEDURE Sales.OrderCalculateTotal
    @OrderId BIGINT,
    @SubtotalOutput DECIMAL(18,2) OUTPUT,
    @TaxOutput DECIMAL(18,2) OUTPUT,
    @TotalOutput DECIMAL(18,2) OUTPUT
AS BEGIN
    -- Implementation
END;
GO

-- Multi-entity context
CREATE PROCEDURE Purchases.ProcessInvoicePayment
    @PurchaseInvoiceId BIGINT,
    @SupplierId BIGINT,
    @PaymentDate DATE,
    @PaymentAmount DECIMAL(18,2),
    @PaymentMethodId INT
AS BEGIN
    -- Implementation
END;
GO
```

### Local Variables

#### Rules

- Always start with `@`
- PascalCase format
- Descriptive names
- Prefix with entity name when needed for clarity

#### Examples

```sql
CREATE PROCEDURE Sales.OrderProcess
    @OrderId BIGINT
AS
BEGIN
    DECLARE @OrderStatus TINYINT;
    DECLARE @CustomerId BIGINT;
    DECLARE @TotalAmount DECIMAL(18,2);
    DECLARE @ErrorMessage NVARCHAR(500);
    DECLARE @CurrentDate DATETIME2(7) = GETUTCDATE();

    -- Table variables
    DECLARE @OrderItems TABLE (
        ProductId BIGINT,
        Quantity DECIMAL(18,4)
    );

    -- Implementation
END;
GO
```

---

## Ecuador-Specific Conventions

### SRI Document Types

#### Entity Names

```sql
SRI.Invoice                    -- Factura
SRI.CreditNote                 -- Nota de Crédito
SRI.DebitNote                  -- Nota de Débito
SRI.DeliveryGuide              -- Guía de Remisión
SRI.RetentionReceipt           -- Comprobante de Retención
SRI.PurchaseSettlement         -- Liquidación de Compra
```

#### Document Number Format

Columns for Ecuador document numbers:

```sql
-- Standard format: 001-001-000000001
EstablishmentCode NVARCHAR(3)      -- 001
PointOfSaleCode NVARCHAR(3)        -- 001
SequentialNumber NVARCHAR(9)       -- 000000001
FullDocumentNumber NVARCHAR(17)    -- 001-001-000000001 (computed)
```

#### Implementation Example

```sql
CREATE TABLE SRI.Invoice
(
    Id BIGINT IDENTITY(1,1) NOT NULL,
    CompanyId BIGINT NOT NULL,
    CustomerId BIGINT NOT NULL,

    -- SRI Document Number
    EstablishmentCode NVARCHAR(3) NOT NULL,
    PointOfSaleCode NVARCHAR(3) NOT NULL,
    SequentialNumber NVARCHAR(9) NOT NULL,
    FullDocumentNumber AS
        (EstablishmentCode + '-' + PointOfSaleCode + '-' + SequentialNumber) PERSISTED,

    -- SRI Identifiers
    AccessKey NVARCHAR(49) NOT NULL,        -- Clave de Acceso (49 chars)
    AuthorizationNumber NVARCHAR(49) NULL,  -- Número de Autorización
    AuthorizationDate DATETIME2(7) NULL,

    -- Document data
    IssueDate DATE NOT NULL,
    DocumentType TINYINT NOT NULL,          -- 01=Factura, 04=Nota Crédito, etc.

    -- Identification
    CustomerRUC NVARCHAR(13) NULL,          -- RUC (13 digits)
    CustomerCedula NVARCHAR(10) NULL,       -- Cédula (10 digits)
    CustomerPassport NVARCHAR(20) NULL,     -- Pasaporte
    CustomerIdentificationType TINYINT NOT NULL, -- 04=RUC, 05=Cédula, 06=Pasaporte

    -- Amounts
    Subtotal0 DECIMAL(18,2) NOT NULL,       -- Base imponible tarifa 0%
    Subtotal12 DECIMAL(18,2) NOT NULL,      -- Base imponible tarifa 12%
    Subtotal15 DECIMAL(18,2) NOT NULL,      -- Base imponible tarifa 15%
    IVA DECIMAL(18,2) NOT NULL,             -- Total IVA
    Total DECIMAL(18,2) NOT NULL,

    -- Status
    Status TINYINT NOT NULL,                 -- 1=Pending, 2=Authorized, 3=Rejected
    XMLSent BIT NOT NULL DEFAULT 0,
    XMLResponse NVARCHAR(MAX) NULL,

    -- Audit
    CreatedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy BIGINT NULL,
    UpdatedAt DATETIME2(7) NULL,
    UpdatedBy BIGINT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,

    CONSTRAINT PK_Invoice_Id PRIMARY KEY (Id),
    CONSTRAINT UQ_Invoice_AccessKey UNIQUE (AccessKey),
    CONSTRAINT UQ_Invoice_FullDocumentNumber
        UNIQUE (CompanyId, EstablishmentCode, PointOfSaleCode, SequentialNumber)
);
GO
```

### Stored Procedures for SRI

#### Examples

```sql
-- Document generation
SRI.InvoiceGenerateAccessKey
SRI.InvoiceGenerateXML
SRI.CreditNoteGenerateAccessKey

-- SRI Web Service operations
SRI.InvoiceSendToSRI
SRI.InvoiceValidateWithSRI
SRI.InvoiceGetAuthorization

-- Document queries
SRI.InvoiceGetByAccessKey
SRI.InvoiceFindByDateRange
SRI.InvoiceFindPendingAuthorization
```

### Configuration Tables

```sql
-- Establishment (Establecimiento)
Common.Establishment

-- Point of Sale (Punto de Emisión)
Common.PointOfSale

-- Tax Configuration
Configuration.TaxRate              -- IVA rates (0%, 12%, 15%)
Configuration.TaxType              -- IVA, ICE, IRBPNR, etc.
```

---

## Security Objects

### Database Roles

#### Naming Pattern

```
role_[Purpose]_[AccessLevel]
```

#### Rules

- Lowercase with underscores
- Clear purpose description
- Access level indicator (read, write, admin)

#### Examples

```sql
-- Application roles
CREATE ROLE role_sales_read;
CREATE ROLE role_sales_write;
CREATE ROLE role_inventory_admin;
CREATE ROLE role_accounting_read;
CREATE ROLE role_restaurant_operator;

-- System roles
CREATE ROLE role_reporting_read;
CREATE ROLE role_backup_operator;
CREATE ROLE role_developer;
```

### Schemas for Security

```sql
-- Use schemas as security boundaries
GRANT SELECT ON SCHEMA::Sales TO role_sales_read;
GRANT SELECT, INSERT, UPDATE ON SCHEMA::Sales TO role_sales_write;
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::Sales TO role_sales_admin;

DENY DELETE ON SCHEMA::Accounting TO role_accounting_write;
```

### Application Users

#### Naming Pattern

```
app_[ApplicationName]_[Environment]
```

#### Examples

```sql
CREATE USER app_webui_prod WITHOUT LOGIN;
CREATE USER app_webui_dev WITHOUT LOGIN;
CREATE USER app_api_gateway_prod WITHOUT LOGIN;
CREATE USER app_reporting_service WITHOUT LOGIN;
```

---

## Migration Scripts

### Naming Pattern

```
[Version]_[Type]_[Description].sql
```

#### Version Formats

- Semantic: `V1.2.3`
- Sequential: `001`, `002`, `003`
- Timestamp: `20251229_1430`

#### Types

- `schema` - Schema changes
- `table` - Table creation/modification
- `data` - Data migrations
- `procedure` - Stored procedure changes
- `index` - Index creation
- `migration` - General migration

#### Rules

- Include rollback script with `_rollback` suffix
- Idempotent when possible
- Include comments explaining purpose

#### Examples

```sql
-- Sequential versioning
001_schema_CreateSalesSchema.sql
002_table_CreateOrderTable.sql
003_data_SeedTaxRates.sql
004_procedure_CreateOrderProcedures.sql
005_index_AddOrderIndexes.sql

-- Semantic versioning
V1.0.0_schema_InitialSetup.sql
V1.1.0_table_AddCustomerLoyalty.sql
V1.1.1_data_FixTaxRates.sql
V1.2.0_migration_RefactorSRITables.sql

-- Timestamp versioning
20251229_1430_table_AddOrderStatusColumn.sql
20251229_1545_procedure_UpdateOrderProcessing.sql

-- Rollback scripts
001_schema_CreateSalesSchema_rollback.sql
V1.1.0_table_AddCustomerLoyalty_rollback.sql
```

#### Migration Script Template

```sql
/*
 * Migration: 005_table_AddOrderHistory
 * Description: Create OrderHistory table for audit trail
 * Author: Development Team
 * Date: 2025-12-29
 * Ticket: JIRA-1234
 */

-- Check if already applied
IF NOT EXISTS (SELECT 1 FROM sys.tables
               WHERE schema_id = SCHEMA_ID('Sales')
               AND name = 'OrderHistory')
BEGIN
    PRINT 'Creating Sales.OrderHistory table...';

    CREATE TABLE Sales.OrderHistory
    (
        -- Table definition
    );

    PRINT 'Sales.OrderHistory table created successfully.';
END
ELSE
BEGIN
    PRINT 'Sales.OrderHistory table already exists. Skipping.';
END;
GO
```

---

## Schemas

### Purpose

Schemas organize database objects by business domain or functional area.

### Naming Pattern

```
[BusinessDomain]
```

### Rules

- PascalCase format
- Singular noun
- Represents a bounded context or business module
- No abbreviations unless standard

### Standard Schemas

```sql
-- Core Business Domains
Sales            -- Sales orders, customers, quotations
Inventory        -- Products, stock, warehouses
Accounting       -- Chart of accounts, journal entries
Restaurant       -- Tables, orders, menu items
Vet              -- Veterinary services, pets, appointments
Mechanical       -- Vehicle services, repairs
BarberShop       -- Appointments, services, stylists
TechnicalSupport -- Tickets, issues, resolutions
Loyalty          -- Rewards programs, points
Purchases        -- Purchase orders, suppliers

-- Shared/Common
Common           -- Companies, users, addresses, shared entities
Configuration    -- System settings, parameters
Security         -- Roles, permissions, authentication
Dbo              -- Default schema (minimize use)

-- Integration
SRI              -- Ecuador tax authority integration
FactElect        -- Electronic invoicing
```

---

## Data Types

### Standard Mapping

| Data Type          | Use Case                   | Notes                       |
| ------------------ | -------------------------- | --------------------------- |
| `BIGINT`           | Primary keys, Foreign keys | Identity(1,1) for PKs       |
| `NVARCHAR(n)`      | Text fields                | Use for Unicode support     |
| `VARCHAR(n)`       | ASCII-only text            | Use when Unicode not needed |
| `NVARCHAR(MAX)`    | Large text                 | Use sparingly               |
| `DECIMAL(p,s)`     | Money, precise numbers     | e.g., DECIMAL(18,2)         |
| `BIT`              | Boolean flags              | Use IsXxx naming            |
| `DATETIME2(7)`     | Timestamps                 | Preferred over DATETIME     |
| `DATE`             | Date only                  | No time component           |
| `TIME(7)`          | Time only                  | No date component           |
| `UNIQUEIDENTIFIER` | GUIDs                      | Use for distributed systems |
| `INT`              | Counts, small numbers      | Max ~2 billion              |
| `SMALLINT`         | Very small numbers         | Max 32,767                  |
| `TINYINT`          | Enums, status codes        | Max 255                     |

### Recommendations

**Strings:**

```sql
-- Short codes (SKU, document numbers)
NVARCHAR(50)

-- Names, descriptions
NVARCHAR(255)

-- Email addresses
NVARCHAR(255)

-- URLs
NVARCHAR(2083)

-- Large text (notes, descriptions)
NVARCHAR(MAX)
```

**Numbers:**

```sql
-- Money, prices, totals
DECIMAL(18, 2)

-- Percentages
DECIMAL(5, 2)  -- 0.00 to 999.99

-- Quantities
DECIMAL(18, 4)

-- Weights
DECIMAL(18, 3)
```

**Dates:**

```sql
-- Timestamps (created, updated, deleted)
DATETIME2(7) NOT NULL DEFAULT GETUTCDATE()

-- Business dates (order date, due date)
DATE

-- Business times (appointment time)
TIME(7)
```

---

## Naming Examples

### Complete Table Example

```sql
CREATE TABLE Sales.Order
(
    -- Primary Key
    Id BIGINT IDENTITY(1,1) NOT NULL,

    -- Foreign Keys
    CustomerId BIGINT NOT NULL,
    CompanyId BIGINT NOT NULL,
    EstablishmentId BIGINT NOT NULL,

    -- Business Data
    OrderNumber NVARCHAR(50) NOT NULL,
    OrderDate DATE NOT NULL,
    DueDate DATE NULL,
    Status TINYINT NOT NULL,  -- 1=Pending, 2=Confirmed, 3=Shipped, etc.

    -- Financial
    Subtotal DECIMAL(18,2) NOT NULL,
    TaxAmount DECIMAL(18,2) NOT NULL,
    DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    Total DECIMAL(18,2) NOT NULL,

    -- Additional Info
    Notes NVARCHAR(MAX) NULL,
    ReferenceNumber NVARCHAR(50) NULL,

    -- Flags
    IsProcessed BIT NOT NULL DEFAULT 0,
    IsCancelled BIT NOT NULL DEFAULT 0,

    -- Audit Fields
    CreatedAt DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy BIGINT NULL,
    UpdatedAt DATETIME2(7) NULL,
    UpdatedBy BIGINT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedAt DATETIME2(7) NULL,
    DeletedBy BIGINT NULL,

    -- Constraints
    CONSTRAINT PK_Order_Id PRIMARY KEY (Id),
    CONSTRAINT FK_Order_Customer_CustomerId
        FOREIGN KEY (CustomerId) REFERENCES Common.Company(Id),
    CONSTRAINT FK_Order_Company_CompanyId
        FOREIGN KEY (CompanyId) REFERENCES Common.Company(Id),
    CONSTRAINT CK_Order_Total_Positive CHECK (Total >= 0),
    CONSTRAINT DF_Order_OrderDate DEFAULT GETDATE(),
    CONSTRAINT UQ_Order_CompanyId_OrderNumber
        UNIQUE (CompanyId, OrderNumber)
);

-- Indexes
CREATE NONCLUSTERED INDEX IX_Order_CustomerId_OrderDate
ON Sales.Order (CustomerId, OrderDate)
INCLUDE (Total, Status);

CREATE NONCLUSTERED INDEX IX_Order_OrderDate
ON Sales.Order (OrderDate DESC)
WHERE IsDeleted = 0;
```

### Complete Stored Procedure Example

```sql
CREATE OR ALTER PROCEDURE Sales.OrderGetById
    @OrderId BIGINT,
    @IncludeDetails BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    -- Validation
    IF @OrderId IS NULL OR @OrderId <= 0
    BEGIN
        THROW 50001, 'OrderId is required and must be positive', 1;
        RETURN;
    END

    -- Main query
    SELECT
        o.Id,
        o.OrderNumber,
        o.OrderDate,
        o.Status,
        o.Total,
        c.Name AS CustomerName,
        c.Email AS CustomerEmail
    FROM Sales.Order o
    INNER JOIN Common.Company c ON o.CustomerId = c.Id
    WHERE o.Id = @OrderId
        AND o.IsDeleted = 0;

    -- Include details if requested
    IF @IncludeDetails = 1
    BEGIN
        SELECT
            od.Id,
            od.LineNumber,
            p.Name AS ProductName,
            od.Quantity,
            od.UnitPrice,
            od.Total
        FROM Sales.OrderDetail od
        INNER JOIN Inventory.Product p ON od.ProductId = p.Id
        WHERE od.OrderId = @OrderId
            AND od.IsDeleted = 0
        ORDER BY od.LineNumber;
    END
END;
GO
```

---

## Best Practices

### 1. Consistency is Key

- Always follow the same patterns
- Document deviations with clear reasons
- Review and update conventions as needed

### 2. Self-Documenting Names

```sql
-- Good: Clear and descriptive with entity context
Sales.OrderCalculateTotal
Restaurant.TableGetAvailable
Restaurant.OrderProcessKitchen       -- Clear: Restaurant Order, not Sales Order
Inventory.ProductValidateStock
Purchases.SupplierGetByRating        -- Clear: Supplier entity in Purchases
Purchases.PurchaseInvoiceApprove     -- Clear: PurchaseInvoice entity

-- Bad: Cryptic and unclear
Sales.sp_calc_tot
Restaurant.get_tbl
Inventory.val_prod
Purchases.GetById                     -- Which entity?
Purchases.Approve                     -- Approve what?
```

### 3. Avoid Reserved Words

```sql
-- Avoid
User
Table
Order
Group
Select

-- Use instead or bracket
[User]
[Table]
[Order]
[Group]
UserAccount
```

### 4. Schema Organization

- Group related objects in the same schema
- Use schemas to enforce security boundaries
- Avoid putting everything in `dbo`

### 5. Documentation

- Add extended properties for tables and columns
- Document complex business rules
- Maintain a data dictionary

```sql
-- Add table description
EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Stores customer sales orders',
    @level0type = N'SCHEMA', @level0name = N'Sales',
    @level1type = N'TABLE', @level1name = N'Order';

-- Add column description
EXEC sys.sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Order status: 1=Pending, 2=Confirmed, 3=Shipped, 4=Delivered, 5=Cancelled',
    @level0type = N'SCHEMA', @level0name = N'Sales',
    @level1type = N'TABLE', @level1name = N'Order',
    @level2type = N'COLUMN', @level2name = N'Status';
```

### 6. Performance Considerations

- Index naming helps identify purpose
- Use filtered indexes with descriptive names
- Document index usage in comments

### 7. Version Control

- Store all database objects in source control
- Use meaningful commit messages
- Follow naming conventions in migration scripts
- Keep migration scripts numbered and sequential
- Always include rollback scripts

### 8. Parameter Documentation

- Document all parameters with comments
- Specify valid ranges and constraints
- Include examples in procedure headers

```sql
/*
 * Procedure: Sales.OrderCreate
 * Description: Creates a new sales order with line items
 *
 * Parameters:
 *   @CustomerId - ID of the customer placing the order (required)
 *   @OrderDate - Order date (defaults to today if NULL)
 *   @EstablishmentId - Establishment ID for document numbering (required)
 *   @OrderDetails - Table of order line items (required, min 1 row)
 *   @OrderIdOutput - Returns the newly created OrderId
 *
 * Returns: OrderId of created order
 *
 * Example:
 *   DECLARE @Items Sales.TVP_OrderDetailList;
 *   INSERT INTO @Items VALUES (1, 10, 15.50, 0);
 *
 *   DECLARE @NewOrderId BIGINT;
 *   EXEC Sales.OrderCreate
 *       @CustomerId = 100,
 *       @OrderDate = '2025-12-29',
 *       @EstablishmentId = 1,
 *       @OrderDetails = @Items,
 *       @OrderIdOutput = @NewOrderId OUTPUT;
 */
```

### 9. Error Handling Standards

```sql
-- Use consistent error number ranges
-- 50000-50999: Business logic errors
-- 51000-51999: Validation errors
-- 52000-52999: Integration errors

CREATE PROCEDURE Sales.OrderCreate
    @CustomerId BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    -- Validation errors (51000 range)
    IF @CustomerId IS NULL OR @CustomerId <= 0
    BEGIN
        THROW 51001, 'CustomerId is required and must be positive', 1;
        RETURN;
    END

    -- Business logic errors (50000 range)
    IF NOT EXISTS (SELECT 1 FROM Common.Company WHERE Id = @CustomerId)
    BEGIN
        THROW 50001, 'Customer not found', 1;
        RETURN;
    END

    -- Implementation
END;
GO
```

### 10. Soft Delete Implementation

```sql
-- Filtered indexes for active records
CREATE NONCLUSTERED INDEX IX_Order_CustomerId_Active
ON Sales.Order (CustomerId, OrderDate)
WHERE IsDeleted = 0;

-- Views for active records
CREATE VIEW Sales.OrderActiveView
AS
SELECT *
FROM Sales.Order
WHERE IsDeleted = 0;
GO

-- Soft delete procedure
CREATE PROCEDURE Sales.OrderDelete
    @OrderId BIGINT,
    @DeletedBy BIGINT
AS
BEGIN
    UPDATE Sales.Order
    SET IsDeleted = 1,
        DeletedAt = GETUTCDATE(),
        DeletedBy = @DeletedBy
    WHERE Id = @OrderId;
END;
GO
```

### 11. Multi-Tenancy Support

```sql
-- All tables include CompanyId for multi-tenant isolation
CREATE TABLE Sales.Order
(
    Id BIGINT IDENTITY(1,1) NOT NULL,
    CompanyId BIGINT NOT NULL,  -- Tenant identifier
    -- Other columns...

    CONSTRAINT FK_Order_Company_CompanyId
        FOREIGN KEY (CompanyId) REFERENCES Common.Company(Id)
);

-- Always filter by CompanyId
CREATE NONCLUSTERED INDEX IX_Order_CompanyId_OrderDate
ON Sales.Order (CompanyId, OrderDate);

-- Row-level security option
CREATE SECURITY POLICY Sales.OrderSecurityPolicy
ADD FILTER PREDICATE Security.fn_SecurityPredicate(CompanyId)
ON Sales.Order
WITH (STATE = ON);
```

---

## Anti-Patterns to Avoid

### ❌ Don't Use

```sql
-- Hungarian notation
tblOrder
strName
intQuantity

-- Cryptic abbreviations
ord_dtl
prod_cat
cust_addr

-- Prefixes without meaning
sp_GetOrders
usp_UpdateProduct
fn_CalcTax

-- Generic names
Data
Info
Temp
Table1

-- All caps
SALES_ORDER
PRODUCT_INVENTORY
CUSTOMER_INFO
```

### ✅ Use Instead

```sql
-- Clear, PascalCase names
Sales.Order
Sales.OrderDetail
Inventory.ProductCategory
Common.CustomerAddress

-- Standard stored procedures with entity names
Sales.OrderGetById
Inventory.ProductUpdate
Inventory.WarehouseGetByRegion        -- Multi-entity schema
Purchases.SupplierCreate              -- Clear entity context
Purchases.PurchaseInvoiceApprove      -- No ambiguity
Restaurant.TableReserve
Restaurant.OrderProcessPayment

-- Utility functions (no entity needed)
Common.fnCalculateTax
Common.fnGetBusinessDays

-- Descriptive views with entity names
Sales.OrderSummaryView
Inventory.ProductStockLevelView
Inventory.WarehouseCapacityView       -- Multi-entity schema
Purchases.SupplierPerformanceView     -- Clear entity
Restaurant.TableOccupancyView
```

---

## Review Checklist

Before implementing any database object, verify:

### Naming

- [ ] Name follows PascalCase convention
- [ ] No abbreviations unless standard
- [ ] Entity name included in multi-entity schemas
- [ ] No SQL reserved words without brackets
- [ ] Schema is appropriate for the object

### Tables

- [ ] Singular entity name
- [ ] All audit columns present (CreatedAt, UpdatedAt, IsDeleted, etc.)
- [ ] CompanyId included for multi-tenancy
- [ ] Primary key follows `PK_` pattern
- [ ] Foreign keys follow `FK_` pattern
- [ ] Indexes follow `IX_` or `UIX_` pattern
- [ ] Constraints are named properly
- [ ] Junction tables use proper naming
- [ ] History/Audit tables suffixed with `History`

### Stored Procedures

- [ ] Entity+Action+Detail pattern
- [ ] Parameters use `@` prefix and PascalCase
- [ ] Output parameters suffixed with `Output`
- [ ] Return value documented
- [ ] Error handling implemented with proper error numbers
- [ ] Header comment with description and examples
- [ ] SET NOCOUNT ON included

### Functions

- [ ] `fn` prefix used
- [ ] Entity name included for multi-entity schemas
- [ ] Return type documented
- [ ] Deterministic when possible

### Triggers

- [ ] `TR_` prefix used
- [ ] Action abbreviation included (AI, AU, AD, etc.)
- [ ] Purpose clearly described in name

### Other Objects

- [ ] Sequences use `SEQ_` prefix
- [ ] Synonyms use `SYN_` prefix
- [ ] Table types use `TVP_` prefix
- [ ] Temporary tables use `#` prefix

### Security

- [ ] Appropriate permissions granted
- [ ] Row-level security considered
- [ ] Multi-tenancy isolation enforced

### Documentation

- [ ] Extended properties added
- [ ] Complex business rules documented
- [ ] Migration script created and tested
- [ ] Rollback script created

---

## Document Version

- **Version**: 2.0
- **Date**: December 29, 2025
- **Author**: Development Team
- **Status**: Active

## Revision History

| Version | Date         | Author   | Changes                                                                                                                                                                                                                                  |
| ------- | ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.0     | Dec 29, 2025 | Dev Team | Added sequences, synonyms, table types, temporary objects, junction tables, audit tables, parameters, Ecuador-specific conventions, security objects, migration scripts, bulk operations, cross-schema guidance, expanded best practices |
| 1.0     | Dec 2025     | Dev Team | Initial version                                                                                                                                                                                                                          |

---

## References

- [SQL Server Naming Conventions - Microsoft Docs](https://docs.microsoft.com/sql/relational-databases/tables/table-naming-conventions)
- [Database Design Best Practices](https://www.sqlshack.com/learn-sql-naming-conventions/)
- [Clean Code Database](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/sql-server-naming-standards/)
