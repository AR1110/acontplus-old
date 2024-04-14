using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechnicalSupport.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddingUserAssigned : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedUserId",
                schema: "TechnicalSupport",
                table: "OrderDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AssignedUserId",
                schema: "TechnicalSupport",
                table: "Order",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedUserId",
                schema: "TechnicalSupport",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "AssignedUserId",
                schema: "TechnicalSupport",
                table: "Order");
        }
    }
}
