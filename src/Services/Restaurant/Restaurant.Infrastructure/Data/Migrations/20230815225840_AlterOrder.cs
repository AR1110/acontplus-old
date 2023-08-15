using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AlterOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CustomerId",
                schema: "Restaurant",
                table: "Order",
                newName: "CustomerCompanyId");

            migrationBuilder.AlterColumn<decimal>(
                name: "Quantity",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CustomerCompanyId",
                schema: "Restaurant",
                table: "Order",
                newName: "CustomerId");

            migrationBuilder.AlterColumn<float>(
                name: "Quantity",
                schema: "Restaurant",
                table: "OrderItem",
                type: "real",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)");
        }
    }
}
