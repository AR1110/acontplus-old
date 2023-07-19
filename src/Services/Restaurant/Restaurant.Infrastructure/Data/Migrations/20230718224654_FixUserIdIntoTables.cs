using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixUserIdIntoTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Table");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Restaurant",
                table: "Dish");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Table",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Room",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Recipe",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Floor",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Restaurant",
                table: "Dish",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
