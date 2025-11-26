using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class FromMobileColumnRestaurant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Table",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Room",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Recipe",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Promotion",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderItem",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderDocument",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Order",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "MenuType",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "MenuItem",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Menu",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "ItemType",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Item",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "IngredientType",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Ingredient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Floor",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "OrderDocument");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "MenuType");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "ItemType");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "IngredientType");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Restaurant",
                table: "Floor");
        }
    }
}
