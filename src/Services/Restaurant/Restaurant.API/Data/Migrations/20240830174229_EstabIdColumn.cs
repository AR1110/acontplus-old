using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class EstabIdColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UI_ProductionArea",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.AddColumn<int>(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Promotion",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Floor",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.CreateIndex(
                name: "UI_ProductionArea",
                schema: "Restaurant",
                table: "ProductionArea",
                column: "Code",
                unique: true);
        }
    }
}
