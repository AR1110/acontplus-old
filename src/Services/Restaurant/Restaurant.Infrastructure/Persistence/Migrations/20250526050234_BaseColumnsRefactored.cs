using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class BaseColumnsRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "UI_MenuType",
                schema: "Restaurant",
                table: "MenuType",
                newName: "UX_MenuType_Code");

            migrationBuilder.RenameIndex(
                name: "UI_ItemType",
                schema: "Restaurant",
                table: "ItemType",
                newName: "UX_ItemType_Code");

            migrationBuilder.RenameIndex(
                name: "UI_IngredientType",
                schema: "Restaurant",
                table: "IngredientType",
                newName: "UX_IngredientType_Code");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Table",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Table",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Table",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Table",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Table",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Room",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Room",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Room",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Room",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Room",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Room",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Room",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Room",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Room",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Room",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Recipe",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Recipe",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Recipe",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Recipe",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Recipe",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Promotion",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Promotion",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Promotion",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Promotion",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Promotion",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderItem",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "OrderItem",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Order",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Order",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Order",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "MenuType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "MenuType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "MenuType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "MenuType",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "MenuType",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "MenuType",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "MenuType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "MenuType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "MenuType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "MenuType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "MenuItem",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "MenuItem",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "MenuItem",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "MenuItem",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "MenuItem",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Menu",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Menu",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Menu",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Menu",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Menu",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Menu",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Menu",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Menu",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Menu",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Menu",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "ItemType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "ItemType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "ItemType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "ItemType",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "ItemType",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "ItemType",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "ItemType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "ItemType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "ItemType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "ItemType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Item",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Item",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Item",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Item",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Item",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "IngredientType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "IngredientType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "IngredientType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "IngredientType",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "IngredientType",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "IngredientType",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "IngredientType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "IngredientType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "IngredientType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "IngredientType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Ingredient",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Ingredient",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Ingredient",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Ingredient",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Ingredient",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Floor",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Floor",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Floor",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Floor",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Floor",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Floor",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Restaurant",
                table: "Floor",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Floor",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Floor",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Floor",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.RenameIndex(
                name: "UX_MenuType_Code",
                schema: "Restaurant",
                table: "MenuType",
                newName: "UI_MenuType");

            migrationBuilder.RenameIndex(
                name: "UX_ItemType_Code",
                schema: "Restaurant",
                table: "ItemType",
                newName: "UI_ItemType");

            migrationBuilder.RenameIndex(
                name: "UX_IngredientType_Code",
                schema: "Restaurant",
                table: "IngredientType",
                newName: "UI_IngredientType");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Room",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Room",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Room",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Order",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Order",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Order",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "MenuType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "MenuType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "MenuType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Menu",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Menu",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Menu",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "ItemType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "ItemType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "ItemType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "IngredientType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "IngredientType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "IngredientType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Floor",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Restaurant",
                table: "Floor",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Restaurant",
                table: "Floor",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
