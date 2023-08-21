using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class CHANGE_IN_RECIPE : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Weight",
                schema: "Restaurant",
                table: "Recipe",
                type: "numeric(18,5)",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "NetWeight",
                schema: "Restaurant",
                table: "Recipe",
                type: "numeric(18,5)",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "Weight",
                schema: "Restaurant",
                table: "Recipe",
                type: "real",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "NetWeight",
                schema: "Restaurant",
                table: "Recipe",
                type: "real",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)");
        }
    }
}
