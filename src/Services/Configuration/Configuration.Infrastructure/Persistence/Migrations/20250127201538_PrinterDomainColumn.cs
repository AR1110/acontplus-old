using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Configuration.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class PrinterDomainColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "UI_PrinterType",
                schema: "Config",
                table: "PrinterType",
                newName: "UX_PrinterType_Code");

            migrationBuilder.RenameIndex(
                name: "UI_EstabLogo_EstablecimientoId",
                schema: "Config",
                table: "EstablecimientoLogo",
                newName: "UX_EstabLogo_EstablecimientoId");

            migrationBuilder.AddColumn<string>(
                name: "Domain",
                schema: "Config",
                table: "Printer",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Domain",
                schema: "Config",
                table: "Printer");

            migrationBuilder.RenameIndex(
                name: "UX_PrinterType_Code",
                schema: "Config",
                table: "PrinterType",
                newName: "UI_PrinterType");

            migrationBuilder.RenameIndex(
                name: "UX_EstabLogo_EstablecimientoId",
                schema: "Config",
                table: "EstablecimientoLogo",
                newName: "UI_EstabLogo_EstablecimientoId");
        }
    }
}
