using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Configuration.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class FromMobileColumnConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "PrinterType",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "PrinterDocument",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "Printer",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Config",
                table: "EstablecimientoLogo");
        }
    }
}
