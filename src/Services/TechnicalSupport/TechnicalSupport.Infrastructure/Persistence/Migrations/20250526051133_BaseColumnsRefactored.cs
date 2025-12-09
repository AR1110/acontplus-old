using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechnicalSupport.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class BaseColumnsRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
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
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
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
                schema: "TechnicalSupport",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Order",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Order",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Order",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Device",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "Device",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "Device",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Device",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Device",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Device",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Device",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Device",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Device",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Device",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Category",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Category",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Category",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Category",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Category",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "WarrantyHistory");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "WarrantyHistory");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "WarrantyHistory");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "WarrantyHistory");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "WarrantyHistory");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "WarrantyHistory");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "WarrantyHistory");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Serie");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Serie");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Serie");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Serie");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Serie");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Serie");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Serie");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderStatus");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "OrderStatus");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "OrderStatus");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "OrderStatus");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "OrderStatus");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "OrderStatus");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderStatus");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Modelo");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Modelo");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Modelo");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Modelo");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Modelo");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Modelo");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Modelo");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceSpecs");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "DeviceSpecs");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceSpecs");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "DeviceSpecs");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "DeviceSpecs");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "DeviceSpecs");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceSpecs");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Device");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Device");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Device");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Device");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Device");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Device");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Device");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "TechnicalSupport",
                table: "Brand");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "TechnicalSupport",
                table: "Brand");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "TechnicalSupport",
                table: "Brand");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "TechnicalSupport",
                table: "Brand");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "TechnicalSupport",
                table: "Brand");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "TechnicalSupport",
                table: "Brand");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "TechnicalSupport",
                table: "Brand");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Order",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "Order",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "Order",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Device",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "Device",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "Device",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Category",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "Category",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "Category",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
