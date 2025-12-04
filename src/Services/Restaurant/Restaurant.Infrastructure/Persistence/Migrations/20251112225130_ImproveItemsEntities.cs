using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ImproveItemsEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemComposition_ItemComposition_ItemCompositionId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropForeignKey(
                name: "FK_ItemComposition_Item_ChildItemId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropForeignKey(
                name: "FK_ItemComposition_Item_ItemId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropForeignKey(
                name: "FK_Order_Table_AppTableId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_ItemType_ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_Item_ItemId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropForeignKey(
                name: "FK_PromotionDetail_Item_ItemId",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropIndex(
                name: "IX_PromotionDetail_PromotionId",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.Sql("""
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_OrderItem_Uuid' AND object_id = OBJECT_ID(N'[Restaurant].[OrderItem]'))
    DROP INDEX [UX_OrderItem_Uuid] ON [Restaurant].[OrderItem];
""");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_OrderId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_Order_AppTableId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_ItemComposition_ItemCompositionId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "CostPrice",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropColumn(
                name: "Obs",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropColumn(
                name: "UniqueId",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropColumn(
                name: "PromotionDays",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "TaxId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "AppTableId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Discount",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "ExtentId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "FeeId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "Instructions",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "ItemCompositionId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "NetWeight",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "TaxId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "UniqueId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "Weight",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "Content",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "Cooking",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "ForPromotion",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "Instructions",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "Recipe",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "Title",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.RenameColumn(
                name: "Quantity",
                schema: "Restaurant",
                table: "PromotionDetail",
                newName: "UnitPrice");

            migrationBuilder.RenameColumn(
                name: "Price",
                schema: "Restaurant",
                table: "PromotionDetail",
                newName: "PromotionalPrice");

            migrationBuilder.RenameColumn(
                name: "S3ObjectUrl",
                schema: "Restaurant",
                table: "Promotion",
                newName: "ImageUrl");

            migrationBuilder.RenameColumn(
                name: "S3ObjectKey",
                schema: "Restaurant",
                table: "Promotion",
                newName: "ImageKey");



            migrationBuilder.RenameColumn(
                name: "Price",
                schema: "Restaurant",
                table: "OrderItem",
                newName: "SalePrice");

            migrationBuilder.RenameColumn(
                name: "Paid",
                schema: "Restaurant",
                table: "OrderItem",
                newName: "IsPaid");

            migrationBuilder.RenameColumn(
                name: "MedidaId",
                schema: "Restaurant",
                table: "OrderItem",
                newName: "MeasureId");

            migrationBuilder.RenameColumn(
                name: "Cost",
                schema: "Restaurant",
                table: "OrderItem",
                newName: "UnitPrice");

            migrationBuilder.RenameColumn(
                name: "BodegaId",
                schema: "Restaurant",
                table: "OrderItem",
                newName: "WarehouseId");

            migrationBuilder.RenameColumn(
                name: "Subtotal",
                schema: "Restaurant",
                table: "ItemComposition",
                newName: "UnitPrice");

            migrationBuilder.RenameColumn(
                name: "Price",
                schema: "Restaurant",
                table: "ItemComposition",
                newName: "TotalPrice");

            migrationBuilder.RenameColumn(
                name: "ItemId",
                schema: "Restaurant",
                table: "ItemComposition",
                newName: "ParentItemId");

            migrationBuilder.RenameColumn(
                name: "CostPrice",
                schema: "Restaurant",
                table: "ItemComposition",
                newName: "TotalCost");

            migrationBuilder.RenameIndex(
                name: "IX_ItemComposition_ItemId",
                schema: "Restaurant",
                table: "ItemComposition",
                newName: "IX_ItemComposition_ParentItemId");

            migrationBuilder.RenameColumn(
                name: "Unit",
                schema: "Restaurant",
                table: "Item",
                newName: "ProductionAreaId");

            migrationBuilder.RenameColumn(
                name: "Quantity",
                schema: "Restaurant",
                table: "Item",
                newName: "PreparationTimeMinutes");

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "PromotionDetail",
                type: "decimal(5,2)",
                precision: 18,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BuyQuantity",
                schema: "Restaurant",
                table: "PromotionDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                schema: "Restaurant",
                table: "PromotionDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GetQuantity",
                schema: "Restaurant",
                table: "PromotionDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                schema: "Restaurant",
                table: "PromotionDetail",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RequiredQuantity",
                schema: "Restaurant",
                table: "PromotionDetail",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 1m);

            migrationBuilder.AddColumn<int>(
                name: "Role",
                schema: "Restaurant",
                table: "PromotionDetail",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                schema: "Restaurant",
                table: "Promotion",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50);

            migrationBuilder.AddColumn<string>(
                name: "ApplicableDays",
                schema: "Restaurant",
                table: "Promotion",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CurrentUses",
                schema: "Restaurant",
                table: "Promotion",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "Promotion",
                type: "decimal(5,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "EndTime",
                schema: "Restaurant",
                table: "Promotion",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxTotalUses",
                schema: "Restaurant",
                table: "Promotion",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxUsesPerCustomer",
                schema: "Restaurant",
                table: "Promotion",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                schema: "Restaurant",
                table: "Promotion",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "StartTime",
                schema: "Restaurant",
                table: "Promotion",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                schema: "Restaurant",
                table: "Promotion",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<decimal>(
                name: "TaxValue",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 2,
                nullable: true,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Obs",
                schema: "Restaurant",
                table: "OrderItem",
                type: "varchar(1000)",
                unicode: false,
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldUnicode: false,
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.Sql("""
DELETE oi
FROM [Restaurant].[OrderItem] oi
WHERE oi.ItemId IS NULL;

DELETE oi
FROM [Restaurant].[OrderItem] oi
WHERE oi.ItemId IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM [Restaurant].[Item] i WHERE i.Id = oi.ItemId);
""");

            migrationBuilder.AlterColumn<int>(
                name: "ItemId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FeeId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(5,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(5,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<decimal>(
                name: "Subtotal",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                schema: "Restaurant",
                table: "Order",
                type: "numeric(5,2)",
                precision: 18,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "WastePercentage",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "decimal(5,2)",
                precision: 18,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MeasureId",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsOptional",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "CompositionLevel",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SalePrice",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "IsAvailableForPromotion",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsComposite",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MeasureId",
                schema: "Restaurant",
                table: "Item",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PreparationInstructions",
                schema: "Restaurant",
                table: "Item",
                type: "varchar(1000)",
                unicode: false,
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresCooking",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "SalePrice",
                schema: "Restaurant",
                table: "Item",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                schema: "Restaurant",
                table: "Item",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "OrderItemModifier",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderItemId = table.Column<int>(type: "int", nullable: false),
                    ModifierItemId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: false, defaultValue: 1m),
                    ExtraCharge = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                    Action = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    Instructions = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    UpdatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    DeletedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItemModifier", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItemModifier_Item_ModifierItemId",
                        column: x => x.ModifierItemId,
                        principalSchema: "Restaurant",
                        principalTable: "Item",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderItemModifier_OrderItem_OrderItemId",
                        column: x => x.OrderItemId,
                        principalSchema: "Restaurant",
                        principalTable: "OrderItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PromotionDetail_Promotion_DisplayOrder",
                schema: "Restaurant",
                table: "PromotionDetail",
                columns: new[] { "PromotionId", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_PromotionDetail_PromotionId",
                schema: "Restaurant",
                table: "PromotionDetail",
                column: "PromotionId")
                .Annotation("SqlServer:Include", new[] { "ItemId", "Role", "PromotionalPrice" });

            migrationBuilder.CreateIndex(
                name: "IX_Promotion_Establishment_Active_Dates",
                schema: "Restaurant",
                table: "Promotion",
                columns: new[] { "EstablishmentId", "IsActive", "StartDate", "EndDate" },
                filter: "[IsActive] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_Promotion_EstablishmentId",
                schema: "Restaurant",
                table: "Promotion",
                column: "EstablishmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Promotion_Type_Active",
                schema: "Restaurant",
                table: "Promotion",
                columns: new[] { "Type", "IsActive" },
                filter: "[IsActive] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_OrderId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "OrderId")
                .Annotation("SqlServer:Include", new[] { "ItemId", "Status", "Total" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_OrderId_Status",
                schema: "Restaurant",
                table: "OrderItem",
                columns: new[] { "OrderId", "Status" },
                filter: "[Status] IN (1, 2, 3)");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_Status_CreatedAt",
                schema: "Restaurant",
                table: "OrderItem",
                columns: new[] { "Status", "CreatedAt" },
                filter: "[Status] = 2");



            migrationBuilder.CreateIndex(
                name: "IX_Order_Customer_Date",
                schema: "Restaurant",
                table: "Order",
                columns: new[] { "CustomerCompanyId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Order_Establishment_Finished_Date",
                schema: "Restaurant",
                table: "Order",
                columns: new[] { "EstablecimientoId", "Finished", "CreatedAt" },
                filter: "[Finished] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Order_TableId",
                schema: "Restaurant",
                table: "Order",
                column: "TableId",
                filter: "[TableId] IS NOT NULL AND [Finished] = 0");



            migrationBuilder.CreateIndex(
                name: "IX_ItemComposition_Parent_DisplayOrder",
                schema: "Restaurant",
                table: "ItemComposition",
                columns: new[] { "ParentItemId", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "UX_ItemComposition_Parent_Child",
                schema: "Restaurant",
                table: "ItemComposition",
                columns: new[] { "ParentItemId", "ChildItemId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Item_ProductId",
                schema: "Restaurant",
                table: "Item",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ProductId_IsActive",
                schema: "Restaurant",
                table: "Item",
                columns: new[] { "ProductId", "IsActive" },
                filter: "[IsActive] = 1");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ProductionAreaId",
                schema: "Restaurant",
                table: "Item",
                column: "ProductionAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_CreatedAt",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_CreatedByUserId",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_IsActive",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_IsDeleted",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_Modifier_Action_Date",
                schema: "Restaurant",
                table: "OrderItemModifier",
                columns: new[] { "ModifierItemId", "Action", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_ModifierItemId",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "ModifierItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_OrderItemId",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "OrderItemId")
                .Annotation("SqlServer:Include", new[] { "ModifierItemId", "Action", "ExtraCharge" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_Status",
                schema: "Restaurant",
                table: "OrderItemModifier",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_OrderItemModifier_OrderItem_Modifier_Action",
                schema: "Restaurant",
                table: "OrderItemModifier",
                columns: new[] { "OrderItemId", "ModifierItemId", "Action" },
                unique: true);

            migrationBuilder.Sql("""
UPDATE i
SET ProductionAreaId = NULL
FROM [Restaurant].[Item] i
WHERE ProductionAreaId IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM [Restaurant].[ProductionArea] pa
      WHERE pa.Id = i.ProductionAreaId
  );
""");

            migrationBuilder.AddForeignKey(
                name: "FK_Item_ProductionArea_ProductionAreaId",
                schema: "Restaurant",
                table: "Item",
                column: "ProductionAreaId",
                principalSchema: "Restaurant",
                principalTable: "ProductionArea",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemComposition_Item_ChildItemId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "ChildItemId",
                principalSchema: "Restaurant",
                principalTable: "Item",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemComposition_Item_ParentItemId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "ParentItemId",
                principalSchema: "Restaurant",
                principalTable: "Item",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Table_TableId",
                schema: "Restaurant",
                table: "Order",
                column: "TableId",
                principalSchema: "Restaurant",
                principalTable: "Table",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_Item_ItemId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "ItemId",
                principalSchema: "Restaurant",
                principalTable: "Item",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PromotionDetail_Item_ItemId",
                schema: "Restaurant",
                table: "PromotionDetail",
                column: "ItemId",
                principalSchema: "Restaurant",
                principalTable: "Item",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Item_ProductionArea_ProductionAreaId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropForeignKey(
                name: "FK_ItemComposition_Item_ChildItemId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropForeignKey(
                name: "FK_ItemComposition_Item_ParentItemId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropForeignKey(
                name: "FK_Order_Table_TableId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_Item_ItemId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropForeignKey(
                name: "FK_PromotionDetail_Item_ItemId",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropTable(
                name: "OrderItemModifier",
                schema: "Restaurant");

            migrationBuilder.DropIndex(
                name: "IX_PromotionDetail_Promotion_DisplayOrder",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropIndex(
                name: "IX_PromotionDetail_PromotionId",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropIndex(
                name: "IX_Promotion_Establishment_Active_Dates",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropIndex(
                name: "IX_Promotion_EstablishmentId",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropIndex(
                name: "IX_Promotion_Type_Active",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_OrderId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_OrderId_Status",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_Status_CreatedAt",
                schema: "Restaurant",
                table: "OrderItem");



            migrationBuilder.DropIndex(
                name: "IX_Order_Customer_Date",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_Establishment_Finished_Date",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_TableId",
                schema: "Restaurant",
                table: "Order");



            migrationBuilder.DropIndex(
                name: "IX_ItemComposition_Parent_DisplayOrder",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropIndex(
                name: "UX_ItemComposition_Parent_Child",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropIndex(
                name: "IX_Item_ProductId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Item_ProductId_IsActive",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Item_ProductionAreaId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "BuyQuantity",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropColumn(
                name: "GetQuantity",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropColumn(
                name: "Notes",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropColumn(
                name: "RequiredQuantity",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropColumn(
                name: "Role",
                schema: "Restaurant",
                table: "PromotionDetail");

            migrationBuilder.DropColumn(
                name: "ApplicableDays",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "CurrentUses",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "EndTime",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "MaxTotalUses",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "MaxUsesPerCustomer",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "Name",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "StartTime",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "Type",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "IsPaid",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "SalePrice",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "Status",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "CompositionLevel",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "IsDefault",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "Notes",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "SalePrice",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "IsAvailableForPromotion",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "IsComposite",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "MeasureId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "PreparationInstructions",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "RequiresCooking",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "SalePrice",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                schema: "Restaurant",
                table: "PromotionDetail",
                newName: "Quantity");

            migrationBuilder.RenameColumn(
                name: "PromotionalPrice",
                schema: "Restaurant",
                table: "PromotionDetail",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                schema: "Restaurant",
                table: "Promotion",
                newName: "S3ObjectUrl");

            migrationBuilder.RenameColumn(
                name: "ImageKey",
                schema: "Restaurant",
                table: "Promotion",
                newName: "S3ObjectKey");

            migrationBuilder.RenameColumn(
                name: "WarehouseId",
                schema: "Restaurant",
                table: "OrderItem",
                newName: "BodegaId");

            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                schema: "Restaurant",
                table: "OrderItem",
                newName: "Cost");



            migrationBuilder.RenameColumn(
                name: "SalePrice",
                schema: "Restaurant",
                table: "OrderItem",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "MeasureId",
                schema: "Restaurant",
                table: "OrderItem",
                newName: "MedidaId");

            migrationBuilder.RenameColumn(
                name: "IsPaid",
                schema: "Restaurant",
                table: "OrderItem",
                newName: "Paid");

            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                schema: "Restaurant",
                table: "ItemComposition",
                newName: "Subtotal");

            migrationBuilder.RenameColumn(
                name: "TotalPrice",
                schema: "Restaurant",
                table: "ItemComposition",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "TotalCost",
                schema: "Restaurant",
                table: "ItemComposition",
                newName: "CostPrice");

            migrationBuilder.RenameColumn(
                name: "ParentItemId",
                schema: "Restaurant",
                table: "ItemComposition",
                newName: "ItemId");

            migrationBuilder.RenameIndex(
                name: "IX_ItemComposition_ParentItemId",
                schema: "Restaurant",
                table: "ItemComposition",
                newName: "IX_ItemComposition_ItemId");

            migrationBuilder.RenameColumn(
                name: "ProductionAreaId",
                schema: "Restaurant",
                table: "Item",
                newName: "Unit");

            migrationBuilder.RenameColumn(
                name: "PreparationTimeMinutes",
                schema: "Restaurant",
                table: "Item",
                newName: "Quantity");

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "PromotionDetail",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 18,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CostPrice",
                schema: "Restaurant",
                table: "PromotionDetail",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "Obs",
                schema: "Restaurant",
                table: "PromotionDetail",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UniqueId",
                schema: "Restaurant",
                table: "PromotionDetail",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                schema: "Restaurant",
                table: "Promotion",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldUnicode: false,
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PromotionDays",
                schema: "Restaurant",
                table: "Promotion",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "TaxValue",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 2,
                oldNullable: true,
                oldDefaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "Obs",
                schema: "Restaurant",
                table: "OrderItem",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(1000)",
                oldUnicode: false,
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ItemId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "FeeId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(5,2)",
                oldPrecision: 18,
                oldScale: 2);

            migrationBuilder.AddColumn<int>(
                name: "ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TaxId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                schema: "Restaurant",
                table: "Order",
                type: "numeric(18,5)",
                precision: 18,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(5,2)",
                oldPrecision: 18,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AppTableId",
                schema: "Restaurant",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "WastePercentage",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 18,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MeasureId",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsOptional",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Discount",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExtentId",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FeeId",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Instructions",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ItemCompositionId",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "NetWeight",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TaxId",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UniqueId",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Weight",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Content",
                schema: "Restaurant",
                table: "Item",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Cooking",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ForPromotion",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Instructions",
                schema: "Restaurant",
                table: "Item",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Recipe",
                schema: "Restaurant",
                table: "Item",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                schema: "Restaurant",
                table: "Item",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PromotionDetail_PromotionId",
                schema: "Restaurant",
                table: "PromotionDetail",
                column: "PromotionId");

            migrationBuilder.CreateIndex(
                name: "UX_OrderItem_Uuid",
                schema: "Restaurant",
                table: "OrderItem",
                column: "Uuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "ItemTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_OrderId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Order_AppTableId",
                schema: "Restaurant",
                table: "Order",
                column: "AppTableId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemComposition_ItemCompositionId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "ItemCompositionId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemComposition_ItemComposition_ItemCompositionId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "ItemCompositionId",
                principalSchema: "Restaurant",
                principalTable: "ItemComposition",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemComposition_Item_ChildItemId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "ChildItemId",
                principalSchema: "Restaurant",
                principalTable: "Item",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemComposition_Item_ItemId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "ItemId",
                principalSchema: "Restaurant",
                principalTable: "Item",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Table_AppTableId",
                schema: "Restaurant",
                table: "Order",
                column: "AppTableId",
                principalSchema: "Restaurant",
                principalTable: "Table",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_ItemType_ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "ItemTypeId",
                principalSchema: "Restaurant",
                principalTable: "ItemType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_Item_ItemId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "ItemId",
                principalSchema: "Restaurant",
                principalTable: "Item",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PromotionDetail_Item_ItemId",
                schema: "Restaurant",
                table: "PromotionDetail",
                column: "ItemId",
                principalSchema: "Restaurant",
                principalTable: "Item",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
