using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechnicalSupport.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class FromMobileColumnTS : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderStatus",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderMaintenance",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderDocument",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Order",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "DeviceSpecs",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Device",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Category",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "WarrantyHistory");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Serie");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderStatus");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderMaintenance");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Modelo");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "DeviceSpecs");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Device");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "TechnicalSupport",
                table: "Brand");
        }
    }
}
