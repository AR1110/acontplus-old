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

- [ ] Name follows PascalCase convention
- [ ] No abbreviations unless standard
- [ ] Schema is appropriate for the object
- [ ] Primary key follows `PK_` pattern
- [ ] Foreign keys follow `FK_` pattern
- [ ] Indexes follow `IX_` or `UIX_` pattern
- [ ] Stored procedures use Entity+Action pattern
- [ ] Functions use `fn` prefix
- [ ] Triggers use `TR_` prefix
- [ ] All audit columns are present (CreatedAt, UpdatedAt, etc.)
- [ ] Data types are appropriate
- [ ] Constraints are named properly
- [ ] No SQL reserved words without brackets
- [ ] Documentation/comments are added

---

## Document Version

- **Version**: 1.0
- **Date**: December 2025
- **Author**: Development Team
- **Status**: Active

## Revision History

| Version | Date     | Author   | Changes         |
| ------- | -------- | -------- | --------------- |
| 1.0     | Dec 2025 | Dev Team | Initial version |

---

## References

- [SQL Server Naming Conventions - Microsoft Docs](https://docs.microsoft.com/sql/relational-databases/tables/table-naming-conventions)
- [Database Design Best Practices](https://www.sqlshack.com/learn-sql-naming-conventions/)
- [Clean Code Database](https://www.red-gate.com/simple-talk/databases/sql-server/database-administration-sql-server/sql-server-naming-standards/)
