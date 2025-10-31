using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Configuration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovingRowVersionColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "EstablecimientoLogo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "PrinterType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "PrinterDocument",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "Printer",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "rowversion",
                rowVersion: true,
                nullable: true);
        }
    }
}
