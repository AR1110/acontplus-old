using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddingItemProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Room",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Order",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "MenuType",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Menu",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "ItemType",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Item",
                newName: "Unit");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "IngredientType",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Floor",
                newName: "IsMobileRequest");

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Table",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Table",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Table",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Table",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Room",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Room",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Room",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Room",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Room",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Room",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Recipe",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Recipe",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Recipe",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Recipe",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Promotion",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Promotion",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Promotion",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Promotion",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderItem",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "OrderItem",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "OrderItem",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "OrderItem",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Order",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Order",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Order",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Order",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Order",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Order",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "MenuType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "MenuType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "MenuType",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "MenuType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "MenuType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "MenuType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "MenuItem",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "MenuItem",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "MenuItem",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "MenuItem",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Menu",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Menu",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Menu",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Menu",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Menu",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Menu",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "ItemType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "ItemType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "ItemType",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "ItemType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "ItemType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "ItemType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Item",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Item",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Item",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ForPromotion",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                schema: "Restaurant",
                table: "Item",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                schema: "Restaurant",
                table: "Item",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Item",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "IngredientType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "IngredientType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "IngredientType",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "IngredientType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "IngredientType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "IngredientType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Ingredient",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Ingredient",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Ingredient",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Ingredient",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Floor",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Floor",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Floor",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Floor",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Floor",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Floor",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Room_CreatedAt",
                schema: "Restaurant",
                table: "Room",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Room_CreatedByUserId",
                schema: "Restaurant",
                table: "Room",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Room_IsActive",
                schema: "Restaurant",
                table: "Room",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Room_IsDeleted",
                schema: "Restaurant",
                table: "Room",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Room_Status",
                schema: "Restaurant",
                table: "Room",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Order_CreatedAt",
                schema: "Restaurant",
                table: "Order",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Order_CreatedByUserId",
                schema: "Restaurant",
                table: "Order",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Order_IsActive",
                schema: "Restaurant",
                table: "Order",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Order_IsDeleted",
                schema: "Restaurant",
                table: "Order",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Order_Status",
                schema: "Restaurant",
                table: "Order",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_MenuType_CreatedAt",
                schema: "Restaurant",
                table: "MenuType",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MenuType_CreatedByUserId",
                schema: "Restaurant",
                table: "MenuType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuType_IsActive",
                schema: "Restaurant",
                table: "MenuType",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_MenuType_IsDeleted",
                schema: "Restaurant",
                table: "MenuType",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MenuType_Status",
                schema: "Restaurant",
                table: "MenuType",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Menu_CreatedAt",
                schema: "Restaurant",
                table: "Menu",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_CreatedByUserId",
                schema: "Restaurant",
                table: "Menu",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_IsActive",
                schema: "Restaurant",
                table: "Menu",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_IsDeleted",
                schema: "Restaurant",
                table: "Menu",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_Status",
                schema: "Restaurant",
                table: "Menu",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_ItemType_CreatedAt",
                schema: "Restaurant",
                table: "ItemType",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ItemType_CreatedByUserId",
                schema: "Restaurant",
                table: "ItemType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemType_IsActive",
                schema: "Restaurant",
                table: "ItemType",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ItemType_IsDeleted",
                schema: "Restaurant",
                table: "ItemType",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ItemType_Status",
                schema: "Restaurant",
                table: "ItemType",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_IngredientType_CreatedAt",
                schema: "Restaurant",
                table: "IngredientType",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_IngredientType_CreatedByUserId",
                schema: "Restaurant",
                table: "IngredientType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_IngredientType_IsActive",
                schema: "Restaurant",
                table: "IngredientType",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_IngredientType_IsDeleted",
                schema: "Restaurant",
                table: "IngredientType",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_IngredientType_Status",
                schema: "Restaurant",
                table: "IngredientType",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Floor_CreatedAt",
                schema: "Restaurant",
                table: "Floor",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Floor_CreatedByUserId",
                schema: "Restaurant",
                table: "Floor",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Floor_IsActive",
                schema: "Restaurant",
                table: "Floor",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Floor_IsDeleted",
                schema: "Restaurant",
                table: "Floor",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Floor_Status",
                schema: "Restaurant",
                table: "Floor",
                columns: new[] { "IsActive", "IsDeleted" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Room_CreatedAt",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropIndex(
                name: "IX_Room_CreatedByUserId",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropIndex(
                name: "IX_Room_IsActive",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropIndex(
                name: "IX_Room_IsDeleted",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropIndex(
                name: "IX_Room_Status",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropIndex(
                name: "IX_Order_CreatedAt",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_CreatedByUserId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_IsActive",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_IsDeleted",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_Status",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_MenuType_CreatedAt",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropIndex(
                name: "IX_MenuType_CreatedByUserId",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropIndex(
                name: "IX_MenuType_IsActive",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropIndex(
                name: "IX_MenuType_IsDeleted",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropIndex(
                name: "IX_MenuType_Status",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropIndex(
                name: "IX_Menu_CreatedAt",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropIndex(
                name: "IX_Menu_CreatedByUserId",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropIndex(
                name: "IX_Menu_IsActive",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropIndex(
                name: "IX_Menu_IsDeleted",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropIndex(
                name: "IX_Menu_Status",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropIndex(
                name: "IX_ItemType_CreatedAt",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropIndex(
                name: "IX_ItemType_CreatedByUserId",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropIndex(
                name: "IX_ItemType_IsActive",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropIndex(
                name: "IX_ItemType_IsDeleted",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropIndex(
                name: "IX_ItemType_Status",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropIndex(
                name: "IX_IngredientType_CreatedAt",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropIndex(
                name: "IX_IngredientType_CreatedByUserId",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropIndex(
                name: "IX_IngredientType_IsActive",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropIndex(
                name: "IX_IngredientType_IsDeleted",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropIndex(
                name: "IX_IngredientType_Status",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropIndex(
                name: "IX_Floor_CreatedAt",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropIndex(
                name: "IX_Floor_CreatedByUserId",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropIndex(
                name: "IX_Floor_IsActive",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropIndex(
                name: "IX_Floor_IsDeleted",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropIndex(
                name: "IX_Floor_Status",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "ForPromotion",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "Quantity",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "Title",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Room",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Order",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "MenuType",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Menu",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "ItemType",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "Unit",
                schema: "Restaurant",
                table: "Item",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "IngredientType",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Restaurant",
                table: "Floor",
                newName: "FromMobile");

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Table",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Table",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Room",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Room",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Room",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Room",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Room",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Room",
                type: "int",
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Recipe",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Recipe",
                type: "int",
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "int",
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Promotion",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Promotion",
                type: "int",
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "int",
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "int",
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderItem",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Order",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Order",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Order",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "MenuType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "MenuType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "MenuType",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "MenuType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "MenuType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "MenuType",
                type: "int",
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "MenuItem",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "MenuItem",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Menu",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Menu",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Menu",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Menu",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Menu",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Menu",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "ItemType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "ItemType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "ItemType",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "ItemType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "ItemType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "ItemType",
                type: "int",
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Item",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "IngredientType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "IngredientType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "IngredientType",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "IngredientType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "IngredientType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "IngredientType",
                type: "int",
                nullable: true);

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
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Ingredient",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Ingredient",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Restaurant",
                table: "Floor",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Floor",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Restaurant",
                table: "Floor",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Floor",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Floor",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Floor",
                type: "int",
                nullable: true);
        }
    }
}
