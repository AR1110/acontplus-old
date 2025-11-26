using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Billing.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class FromMobileColumnFactElect : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Customer",
                table: "Customer",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Customer",
                table: "Customer",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Customer",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Customer",
                table: "Customer");
        }
    }
}
