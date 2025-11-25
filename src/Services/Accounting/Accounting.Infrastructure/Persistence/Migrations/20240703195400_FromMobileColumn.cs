using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class FromMobileColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Tipo",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Category",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Tipo");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Subcategory");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Category");
        }
    }
}
