using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Configuracion.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class LatestVersion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LatestVersion",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LatestVersion",
                schema: "Config",
                table: "EstablecimientoLogo");
        }
    }
}
