using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixDecimalColumnTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Weight",
                schema: "Restaurant",
                table: "Recipe",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "NetWeight",
                schema: "Restaurant",
                table: "Recipe",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "CostPrice",
                schema: "Restaurant",
                table: "Recipe",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Progress",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "UnitPrice",
                schema: "Restaurant",
                table: "OrderItem",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "Total",
                schema: "Restaurant",
                table: "OrderItem",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "TaxValue",
                schema: "Restaurant",
                table: "OrderItem",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true,
                oldDefaultValue: 0m);

            migrationBuilder.AlterColumn<decimal>(
                name: "Subtotal",
                schema: "Restaurant",
                table: "OrderItem",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "SalePrice",
                schema: "Restaurant",
                table: "OrderItem",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "RemainingQuantity",
                schema: "Restaurant",
                table: "OrderItem",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Quantity",
                schema: "Restaurant",
                table: "OrderItem",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "OrderItem",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric(5,2)",
                oldPrecision: 5,
                oldScale: 2,
                oldDefaultValue: 0m);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                schema: "Restaurant",
                table: "OrderItem",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(5,2)",
                oldPrecision: 5,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Total",
                schema: "Restaurant",
                table: "Order",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "Tip",
                schema: "Restaurant",
                table: "Order",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Tax",
                schema: "Restaurant",
                table: "Order",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                schema: "Restaurant",
                table: "Order",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(5,2)",
                oldPrecision: 5,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Subtotal",
                schema: "Restaurant",
                table: "MenuItem",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Quantity",
                schema: "Restaurant",
                table: "MenuItem",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountValue",
                schema: "Restaurant",
                table: "MenuItem",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "MenuItem",
                type: "decimal(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Weight",
                schema: "Restaurant",
                table: "Recipe",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "NetWeight",
                schema: "Restaurant",
                table: "Recipe",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "CostPrice",
                schema: "Restaurant",
                table: "Recipe",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Progress",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "UnitPrice",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "Total",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "TaxValue",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true,
                oldDefaultValue: 0m);

            migrationBuilder.AlterColumn<decimal>(
                name: "Subtotal",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "SalePrice",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "RemainingQuantity",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Quantity",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 5,
                oldScale: 2,
                oldDefaultValue: 0m);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                schema: "Restaurant",
                table: "OrderItem",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 5,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Total",
                schema: "Restaurant",
                table: "Order",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5);

            migrationBuilder.AlterColumn<decimal>(
                name: "Tip",
                schema: "Restaurant",
                table: "Order",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Tax",
                schema: "Restaurant",
                table: "Order",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discount",
                schema: "Restaurant",
                table: "Order",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 5,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Subtotal",
                schema: "Restaurant",
                table: "MenuItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Quantity",
                schema: "Restaurant",
                table: "MenuItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountValue",
                schema: "Restaurant",
                table: "MenuItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountPercent",
                schema: "Restaurant",
                table: "MenuItem",
                type: "numeric(18,5)",
                precision: 18,
                scale: 5,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,5)",
                oldPrecision: 18,
                oldScale: 5,
                oldNullable: true);
        }
    }
}
