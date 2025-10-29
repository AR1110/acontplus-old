using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RestoreDefaultEntityValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Table",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Table",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Table",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Recipe",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Recipe",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Recipe",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Promotion",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Promotion",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Promotion",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "OrderItem",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderItem",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderItem",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "MenuItem",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "MenuItem",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "MenuItem",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Item",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Item",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Item",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Ingredient",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Ingredient",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Ingredient",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateIndex(
                name: "IX_AppTable_CreatedAt",
                schema: "Restaurant",
                table: "Table",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_AppTable_CreatedByUserId",
                schema: "Restaurant",
                table: "Table",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTable_IsActive",
                schema: "Restaurant",
                table: "Table",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_AppTable_IsDeleted",
                schema: "Restaurant",
                table: "Table",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AppTable_Status",
                schema: "Restaurant",
                table: "Table",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Recipe_CreatedAt",
                schema: "Restaurant",
                table: "Recipe",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Recipe_CreatedByUserId",
                schema: "Restaurant",
                table: "Recipe",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Recipe_IsActive",
                schema: "Restaurant",
                table: "Recipe",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Recipe_IsDeleted",
                schema: "Restaurant",
                table: "Recipe",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Recipe_Status",
                schema: "Restaurant",
                table: "Recipe",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_PromotionMenu_CreatedAt",
                schema: "Restaurant",
                table: "PromotionMenu",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionMenu_CreatedByUserId",
                schema: "Restaurant",
                table: "PromotionMenu",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionMenu_IsActive",
                schema: "Restaurant",
                table: "PromotionMenu",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionMenu_IsDeleted",
                schema: "Restaurant",
                table: "PromotionMenu",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionMenu_Status",
                schema: "Restaurant",
                table: "PromotionMenu",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Promotion_CreatedAt",
                schema: "Restaurant",
                table: "Promotion",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Promotion_CreatedByUserId",
                schema: "Restaurant",
                table: "Promotion",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Promotion_IsActive",
                schema: "Restaurant",
                table: "Promotion",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Promotion_IsDeleted",
                schema: "Restaurant",
                table: "Promotion",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Promotion_Status",
                schema: "Restaurant",
                table: "Promotion",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductionArea_CreatedAt",
                schema: "Restaurant",
                table: "ProductionArea",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ProductionArea_CreatedByUserId",
                schema: "Restaurant",
                table: "ProductionArea",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductionArea_IsActive",
                schema: "Restaurant",
                table: "ProductionArea",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ProductionArea_IsDeleted",
                schema: "Restaurant",
                table: "ProductionArea",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ProductionArea_Status",
                schema: "Restaurant",
                table: "ProductionArea",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderKitchen_CreatedAt",
                schema: "Restaurant",
                table: "OrderKitchen",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_OrderKitchen_CreatedByUserId",
                schema: "Restaurant",
                table: "OrderKitchen",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderKitchen_IsActive",
                schema: "Restaurant",
                table: "OrderKitchen",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_OrderKitchen_IsDeleted",
                schema: "Restaurant",
                table: "OrderKitchen",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_OrderKitchen_Status",
                schema: "Restaurant",
                table: "OrderKitchen",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_CreatedAt",
                schema: "Restaurant",
                table: "OrderItem",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_CreatedByUserId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_IsActive",
                schema: "Restaurant",
                table: "OrderItem",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_IsDeleted",
                schema: "Restaurant",
                table: "OrderItem",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_Status",
                schema: "Restaurant",
                table: "OrderItem",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderDocument_CreatedAt",
                schema: "Restaurant",
                table: "OrderDocument",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDocument_CreatedByUserId",
                schema: "Restaurant",
                table: "OrderDocument",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDocument_IsActive",
                schema: "Restaurant",
                table: "OrderDocument",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDocument_IsDeleted",
                schema: "Restaurant",
                table: "OrderDocument",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDocument_Status",
                schema: "Restaurant",
                table: "OrderDocument",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_MenuItem_CreatedAt",
                schema: "Restaurant",
                table: "MenuItem",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItem_CreatedByUserId",
                schema: "Restaurant",
                table: "MenuItem",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItem_IsActive",
                schema: "Restaurant",
                table: "MenuItem",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItem_IsDeleted",
                schema: "Restaurant",
                table: "MenuItem",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItem_Status",
                schema: "Restaurant",
                table: "MenuItem",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Item_CreatedAt",
                schema: "Restaurant",
                table: "Item",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Item_CreatedByUserId",
                schema: "Restaurant",
                table: "Item",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Item_IsActive",
                schema: "Restaurant",
                table: "Item",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Item_IsDeleted",
                schema: "Restaurant",
                table: "Item",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Item_Status",
                schema: "Restaurant",
                table: "Item",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Ingredient_CreatedAt",
                schema: "Restaurant",
                table: "Ingredient",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Ingredient_CreatedByUserId",
                schema: "Restaurant",
                table: "Ingredient",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Ingredient_IsActive",
                schema: "Restaurant",
                table: "Ingredient",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Ingredient_IsDeleted",
                schema: "Restaurant",
                table: "Ingredient",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Ingredient_Status",
                schema: "Restaurant",
                table: "Ingredient",
                columns: new[] { "IsActive", "IsDeleted" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppTable_CreatedAt",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropIndex(
                name: "IX_AppTable_CreatedByUserId",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropIndex(
                name: "IX_AppTable_IsActive",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropIndex(
                name: "IX_AppTable_IsDeleted",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropIndex(
                name: "IX_AppTable_Status",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropIndex(
                name: "IX_Recipe_CreatedAt",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropIndex(
                name: "IX_Recipe_CreatedByUserId",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropIndex(
                name: "IX_Recipe_IsActive",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropIndex(
                name: "IX_Recipe_IsDeleted",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropIndex(
                name: "IX_Recipe_Status",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropIndex(
                name: "IX_PromotionMenu_CreatedAt",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropIndex(
                name: "IX_PromotionMenu_CreatedByUserId",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropIndex(
                name: "IX_PromotionMenu_IsActive",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropIndex(
                name: "IX_PromotionMenu_IsDeleted",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropIndex(
                name: "IX_PromotionMenu_Status",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropIndex(
                name: "IX_Promotion_CreatedAt",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropIndex(
                name: "IX_Promotion_CreatedByUserId",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropIndex(
                name: "IX_Promotion_IsActive",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropIndex(
                name: "IX_Promotion_IsDeleted",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropIndex(
                name: "IX_Promotion_Status",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropIndex(
                name: "IX_ProductionArea_CreatedAt",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropIndex(
                name: "IX_ProductionArea_CreatedByUserId",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropIndex(
                name: "IX_ProductionArea_IsActive",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropIndex(
                name: "IX_ProductionArea_IsDeleted",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropIndex(
                name: "IX_ProductionArea_Status",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropIndex(
                name: "IX_OrderKitchen_CreatedAt",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropIndex(
                name: "IX_OrderKitchen_CreatedByUserId",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropIndex(
                name: "IX_OrderKitchen_IsActive",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropIndex(
                name: "IX_OrderKitchen_IsDeleted",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropIndex(
                name: "IX_OrderKitchen_Status",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_CreatedAt",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_CreatedByUserId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_IsActive",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_IsDeleted",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_Status",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderDocument_CreatedAt",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropIndex(
                name: "IX_OrderDocument_CreatedByUserId",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropIndex(
                name: "IX_OrderDocument_IsActive",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropIndex(
                name: "IX_OrderDocument_IsDeleted",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropIndex(
                name: "IX_OrderDocument_Status",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropIndex(
                name: "IX_MenuItem_CreatedAt",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropIndex(
                name: "IX_MenuItem_CreatedByUserId",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropIndex(
                name: "IX_MenuItem_IsActive",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropIndex(
                name: "IX_MenuItem_IsDeleted",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropIndex(
                name: "IX_MenuItem_Status",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropIndex(
                name: "IX_Item_CreatedAt",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Item_CreatedByUserId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Item_IsActive",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Item_IsDeleted",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Item_Status",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Ingredient_CreatedAt",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropIndex(
                name: "IX_Ingredient_CreatedByUserId",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropIndex(
                name: "IX_Ingredient_IsActive",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropIndex(
                name: "IX_Ingredient_IsDeleted",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropIndex(
                name: "IX_Ingredient_Status",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Table",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Table",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Table",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Recipe",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Recipe",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Recipe",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Promotion",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Promotion",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Promotion",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "OrderItem",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderItem",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderItem",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "MenuItem",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "MenuItem",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "MenuItem",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Item",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Item",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Item",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Ingredient",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Ingredient",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Ingredient",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");
        }
    }
}
