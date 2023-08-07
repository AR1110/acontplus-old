using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProductionArea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductionAreaId",
                schema: "Restaurant",
                table: "Dish",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ProductionArea",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Description = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductionArea", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dish_ProductionAreaId",
                schema: "Restaurant",
                table: "Dish",
                column: "ProductionAreaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dish_ProductionArea_ProductionAreaId",
                schema: "Restaurant",
                table: "Dish",
                column: "ProductionAreaId",
                principalSchema: "Restaurant",
                principalTable: "ProductionArea",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dish_ProductionArea_ProductionAreaId",
                schema: "Restaurant",
                table: "Dish");

            migrationBuilder.DropTable(
                name: "ProductionArea",
                schema: "Restaurant");

            migrationBuilder.DropIndex(
                name: "IX_Dish_ProductionAreaId",
                schema: "Restaurant",
                table: "Dish");

            migrationBuilder.DropColumn(
                name: "ProductionAreaId",
                schema: "Restaurant",
                table: "Dish");
        }
    }
}
