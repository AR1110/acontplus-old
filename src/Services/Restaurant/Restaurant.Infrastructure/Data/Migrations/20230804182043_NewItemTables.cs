using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class NewItemTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recipe_Dish_DishId",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropTable(
                name: "Dish",
                schema: "Restaurant");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                schema: "Restaurant",
                table: "Recipe",
                newName: "Unit");

            migrationBuilder.RenameColumn(
                name: "DishId",
                schema: "Restaurant",
                table: "Recipe",
                newName: "ItemId");

            migrationBuilder.RenameIndex(
                name: "IX_Recipe_DishId",
                schema: "Restaurant",
                table: "Recipe",
                newName: "IX_Recipe_ItemId");

            migrationBuilder.AddColumn<int>(
                name: "IngredientId",
                schema: "Restaurant",
                table: "Recipe",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Instructions",
                schema: "Restaurant",
                table: "Recipe",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Quantity",
                schema: "Restaurant",
                table: "Recipe",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateTable(
                name: "Ingredient",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Summary = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    TypeId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Unit = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingredient", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Item",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ProductionAreaId = table.Column<int>(type: "int", nullable: true),
                    Summary = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    Cooking = table.Column<bool>(type: "bit", nullable: false),
                    Recipe = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Instructions = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Content = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Item", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Item_ProductionArea_ProductionAreaId",
                        column: x => x.ProductionAreaId,
                        principalSchema: "Restaurant",
                        principalTable: "ProductionArea",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Menu",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
                    Summary = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    TypeId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Menu", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MenuItem",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MenuId = table.Column<int>(type: "int", nullable: false),
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuItem_Item_ItemId",
                        column: x => x.ItemId,
                        principalSchema: "Restaurant",
                        principalTable: "Item",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MenuItem_Menu_MenuId",
                        column: x => x.MenuId,
                        principalSchema: "Restaurant",
                        principalTable: "Menu",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Recipe_IngredientId",
                schema: "Restaurant",
                table: "Recipe",
                column: "IngredientId");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ProductionAreaId",
                schema: "Restaurant",
                table: "Item",
                column: "ProductionAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItem_ItemId",
                schema: "Restaurant",
                table: "MenuItem",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItem_MenuId",
                schema: "Restaurant",
                table: "MenuItem",
                column: "MenuId");

            migrationBuilder.AddForeignKey(
                name: "FK_Recipe_Ingredient_IngredientId",
                schema: "Restaurant",
                table: "Recipe",
                column: "IngredientId",
                principalSchema: "Restaurant",
                principalTable: "Ingredient",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Recipe_Item_ItemId",
                schema: "Restaurant",
                table: "Recipe",
                column: "ItemId",
                principalSchema: "Restaurant",
                principalTable: "Item",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recipe_Ingredient_IngredientId",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropForeignKey(
                name: "FK_Recipe_Item_ItemId",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropTable(
                name: "Ingredient",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "MenuItem",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "Item",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "Menu",
                schema: "Restaurant");

            migrationBuilder.DropIndex(
                name: "IX_Recipe_IngredientId",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "IngredientId",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "Instructions",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.DropColumn(
                name: "Quantity",
                schema: "Restaurant",
                table: "Recipe");

            migrationBuilder.RenameColumn(
                name: "Unit",
                schema: "Restaurant",
                table: "Recipe",
                newName: "ProductId");

            migrationBuilder.RenameColumn(
                name: "ItemId",
                schema: "Restaurant",
                table: "Recipe",
                newName: "DishId");

            migrationBuilder.RenameIndex(
                name: "IX_Recipe_ItemId",
                schema: "Restaurant",
                table: "Recipe",
                newName: "IX_Recipe_DishId");

            migrationBuilder.CreateTable(
                name: "Dish",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductionAreaId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dish", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Dish_ProductionArea_ProductionAreaId",
                        column: x => x.ProductionAreaId,
                        principalSchema: "Restaurant",
                        principalTable: "ProductionArea",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dish_ProductionAreaId",
                schema: "Restaurant",
                table: "Dish",
                column: "ProductionAreaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Recipe_Dish_DishId",
                schema: "Restaurant",
                table: "Recipe",
                column: "DishId",
                principalSchema: "Restaurant",
                principalTable: "Dish",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
