using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UPDATE_COLUMN : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Day",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.AddColumn<bool>(
                name: "selected",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "promotionDays",
                schema: "Restaurant",
                table: "Promotion",
                type: "varchar(max)",
                unicode: false,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "selected",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "promotionDays",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.AddColumn<int>(
                name: "Day",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
