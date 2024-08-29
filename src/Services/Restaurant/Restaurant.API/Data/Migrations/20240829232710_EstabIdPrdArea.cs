using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class EstabIdPrdArea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "ProductionArea",
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
                table: "ProductionArea");
        }
    }
}
