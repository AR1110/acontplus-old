using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class IngredientType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TypeId",
                schema: "Restaurant",
                table: "Ingredient",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IngredientTypeId",
                schema: "Restaurant",
                table: "Ingredient",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ingredient_IngredientTypeId",
                schema: "Restaurant",
                table: "Ingredient",
                column: "IngredientTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ingredient_IngredientType_IngredientTypeId",
                schema: "Restaurant",
                table: "Ingredient",
                column: "IngredientTypeId",
                principalSchema: "Restaurant",
                principalTable: "IngredientType",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ingredient_IngredientType_IngredientTypeId",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropIndex(
                name: "IX_Ingredient_IngredientTypeId",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.DropColumn(
                name: "IngredientTypeId",
                schema: "Restaurant",
                table: "Ingredient");

            migrationBuilder.AlterColumn<int>(
                name: "TypeId",
                schema: "Restaurant",
                table: "Ingredient",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
