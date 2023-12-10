using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechnicalSupport.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class OrderDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDetail_Device_ProductId",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "Cost",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "Discount",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "FeeId",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "Price",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "Quantity",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "TaxId",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "TaxPercentId",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "TaxValue",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "Total",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                newName: "DeviceId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderDetail_ProductId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                newName: "IX_OrderDetail_DeviceId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDetail_Device_DeviceId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                column: "DeviceId",
                principalSchema: "TechnicalSupport",
                principalTable: "Device",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDetail_Device_DeviceId",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.RenameColumn(
                name: "DeviceId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderDetail_DeviceId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                newName: "IX_OrderDetail_ProductId");

            migrationBuilder.AddColumn<decimal>(
                name: "Cost",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Discount",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "FeeId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Quantity",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "TaxId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TaxPercentId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TaxValue",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "numeric(18,5)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Total",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDetail_Device_ProductId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                column: "ProductId",
                principalSchema: "TechnicalSupport",
                principalTable: "Device",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
