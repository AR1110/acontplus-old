using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechnicalSupport.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class OrderColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Finished",
                schema: "TechnicalSupport",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TaxPercentId",
                schema: "TechnicalSupport",
                table: "Order",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Finished",
                schema: "TechnicalSupport",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "TaxPercentId",
                schema: "TechnicalSupport",
                table: "Order");
        }
    }
}
