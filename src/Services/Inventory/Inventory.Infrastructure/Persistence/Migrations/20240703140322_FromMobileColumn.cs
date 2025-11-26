using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventory.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class FromMobileColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "StockFisico",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Inventario",
                table: "SubcategoryPhoto");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Inventario",
                table: "StockFisicoDetalle");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Inventario",
                table: "StockFisico");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Inventario",
                table: "ProductPhoto");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Inventario",
                table: "MotivoDiscrepancia");
        }
    }
}
