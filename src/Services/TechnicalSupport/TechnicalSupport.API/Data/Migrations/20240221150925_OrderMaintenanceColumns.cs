using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechnicalSupport.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class OrderMaintenanceColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldUnicode: false,
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "nvarchar(5)",
                maxLength: 5,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(5)",
                oldUnicode: false,
                oldMaxLength: 5);

            migrationBuilder.AddColumn<int>(
                name: "BodegaId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "Cost",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Discount",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "FeeId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MedidaId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Obs",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Quantity",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "TaxId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TaxPercentId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "TaxValue",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Total",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "Obs",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldUnicode: false,
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Serie",
                schema: "TechnicalSupport",
                table: "Order",
                type: "nvarchar(18)",
                maxLength: 18,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(18)",
                oldUnicode: false,
                oldMaxLength: 18);

            migrationBuilder.AlterColumn<string>(
                name: "Obs",
                schema: "TechnicalSupport",
                table: "Order",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldUnicode: false,
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Specs",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(max)",
                oldUnicode: false);

            migrationBuilder.AlterColumn<string>(
                name: "SerialNumber",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldUnicode: false,
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "TechnicalSupport",
                table: "Device",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(300)",
                oldUnicode: false,
                oldMaxLength: 300);

            migrationBuilder.AlterColumn<string>(
                name: "Model",
                schema: "TechnicalSupport",
                table: "Device",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(300)",
                oldUnicode: false,
                oldMaxLength: 300,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                schema: "TechnicalSupport",
                table: "Device",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldUnicode: false,
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Brand",
                schema: "TechnicalSupport",
                table: "Device",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(300)",
                oldUnicode: false,
                oldMaxLength: 300,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "TechnicalSupport",
                table: "Category",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(300)",
                oldUnicode: false,
                oldMaxLength: 300);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "Category",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldUnicode: false,
                oldMaxLength: 8);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BodegaId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "Cost",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "Discount",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "FeeId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "MedidaId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "Obs",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "Price",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "Quantity",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "TaxId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "TaxPercentId",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "TaxValue",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "Total",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "varchar(5)",
                unicode: false,
                maxLength: 5,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(5)",
                oldMaxLength: 5);

            migrationBuilder.AlterColumn<string>(
                name: "Obs",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Serie",
                schema: "TechnicalSupport",
                table: "Order",
                type: "varchar(18)",
                unicode: false,
                maxLength: 18,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(18)",
                oldMaxLength: 18);

            migrationBuilder.AlterColumn<string>(
                name: "Obs",
                schema: "TechnicalSupport",
                table: "Order",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Specs",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "varchar(max)",
                unicode: false,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "SerialNumber",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "TechnicalSupport",
                table: "Device",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(300)",
                oldMaxLength: 300);

            migrationBuilder.AlterColumn<string>(
                name: "Model",
                schema: "TechnicalSupport",
                table: "Device",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(300)",
                oldMaxLength: 300,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                schema: "TechnicalSupport",
                table: "Device",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Brand",
                schema: "TechnicalSupport",
                table: "Device",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(300)",
                oldMaxLength: 300,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "TechnicalSupport",
                table: "Category",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(300)",
                oldMaxLength: 300);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "Category",
                type: "varchar(8)",
                unicode: false,
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(8)",
                oldMaxLength: 8);
        }
    }
}
