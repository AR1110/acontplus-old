# Restaurant API - Database Schema Changes

## Migration: ImproveItemsEntities (20251112225130)

This migration introduces significant improvements to the Restaurant service database schema, focusing on better data
organization, enhanced functionality, and improved performance.

## 🔄 Column Renames

### OrderItem Table

- `Paid` → `IsPaid` - Better boolean naming convention
- `BodegaId` → `WarehouseId` - Clearer English naming
- `Cost` → `UnitPrice` - More descriptive pricing field
- `Price` → `SalePrice` - Distinguishes from unit price
- `MedidaId` → `MeasureId` - English naming consistency

### Other Tables

- `ItemComposition.ItemId` → `ParentItemId` - Clearer hierarchy relationship
- `Item.Unit` → `ProductionAreaId` - Links to production areas
- `Item.Quantity` → `PreparationTimeMinutes` - Time-based field

## ➕ New Features

### Enhanced Promotions

- **Promotion Types**: Added `Type` enum for different promotion categories
- **Time-based Promotions**: `StartTime` and `EndTime` for daily scheduling
- **Usage Limits**: `MaxTotalUses` and `MaxUsesPerCustomer` for better control
- **Flexible Discounts**: Support for percentage-based discounts
- **Better Organization**: `Name`, improved `Description` length, `ApplicableDays`

### Advanced Order Management

- **Order Status Tracking**: New `Status` field for order items
- **Enhanced Pricing**: Separate `UnitPrice` and `SalePrice` fields
- **Discount System**: `DiscountPercent` for percentage-based discounts
- **Payment Tracking**: Improved `IsPaid` boolean field

### Item Composition Improvements

- **Hierarchy Levels**: `CompositionLevel` for nested compositions
- **Display Control**: `DisplayOrder` for UI presentation
- **Default Options**: `IsDefault` flag for standard selections
- **Enhanced Pricing**: Separate unit and total pricing fields

### Item Enhancements

- **Production Integration**: Links to production areas
- **Preparation Management**: Time tracking and cooking requirements
- **Promotion Eligibility**: `IsAvailableForPromotion` flag
- **Composite Items**: `IsComposite` for complex menu items

## 🗂️ New Tables

### OrderItemModifier

Manages item modifications and customizations:

- **Modifier Tracking**: Links modifiers to order items
- **Action Types**: Add, remove, or replace modifiers
- **Pricing**: Extra charges for modifications
- **Instructions**: Custom preparation notes

## 🔧 Performance Improvements

### New Indexes

- **Promotion Queries**: Optimized for active promotions by establishment
- **Order Processing**: Enhanced indexes for order status tracking
- **Item Relationships**: Better performance for composition queries
- **Modifier Tracking**: Efficient modifier lookup and processing

## 📊 Data Precision Updates

### Decimal Precision Changes

- **Discount Fields**: Changed from `decimal(18,5)` to `decimal(5,2)` for percentage values
- **Price Fields**: Standardized precision across all monetary fields
- **Quantity Fields**: Improved precision for measurements

## 🔒 Constraint Improvements

### Unique Constraints

- **Order Items**: UUID-based unique identification
- **Orders**: UUID-based unique identification
- **Item Compositions**: Unique parent-child relationships

### Foreign Key Updates

- **Cascade Rules**: Improved referential integrity
- **Null Handling**: Better handling of optional relationships

## 🚀 Migration Benefits

1. **Better Performance**: Optimized indexes for common queries
2. **Enhanced Functionality**: Support for complex promotions and modifiers
3. **Improved Data Integrity**: Better constraints and relationships
4. **Clearer Schema**: More descriptive field names and organization
5. **Scalability**: Support for hierarchical item compositions

## ⚠️ Breaking Changes

### Removed Fields

- Various legacy fields removed from `Item`, `ItemComposition`, and `PromotionDetail`
- Old foreign key relationships updated

### Field Type Changes

- Several decimal precision changes
- Boolean field improvements
- String length modifications

## 🔄 Rollback Support

The migration includes a complete `Down()` method that reverses all changes, ensuring safe rollback if needed.

## 📝 Usage Notes

1. **Update Application Code**: Ensure all references to renamed fields are updated
2. **Test Thoroughly**: Verify all functionality with the new schema
3. **Monitor Performance**: Check query performance with new indexes
4. **Data Migration**: Existing data is preserved through the migration process

## 🏗️ Architecture Impact

This migration supports the evolution toward a more sophisticated restaurant management system with:

- Advanced promotion management
- Flexible item composition
- Enhanced order tracking
- Better modifier support
- Improved performance characteristics
