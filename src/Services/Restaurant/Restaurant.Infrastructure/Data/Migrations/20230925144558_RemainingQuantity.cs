using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemainingQuantity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_ItemType_ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.AddColumn<decimal>(
                name: "RemainingQuantity",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_ItemType_ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "RemainingQuantity",
                schema: "Restaurant",
                table: "OrderItem");
        }
    }
}
