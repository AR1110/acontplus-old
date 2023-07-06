using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class TablesUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.AddColumn<string>(
                name: "EstabCod",
                schema: "Restaurant",
                table: "Floor",
                type: "varchar(max)",
                unicode: false,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstabCod",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.AddColumn<int>(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Floor",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
