using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddingUniqueIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "UI_ProductionArea",
                schema: "Restaurant",
                table: "ProductionArea",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_MenuType",
                schema: "Restaurant",
                table: "MenuType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_ItemType",
                schema: "Restaurant",
                table: "ItemType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_IngredientType",
                schema: "Restaurant",
                table: "IngredientType",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UI_ProductionArea",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropIndex(
                name: "UI_MenuType",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropIndex(
                name: "UI_ItemType",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropIndex(
                name: "UI_IngredientType",
                schema: "Restaurant",
                table: "IngredientType");
        }
    }
}
