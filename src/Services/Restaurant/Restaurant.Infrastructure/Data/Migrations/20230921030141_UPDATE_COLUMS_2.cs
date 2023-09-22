using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UPDATE_COLUMS_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndHour",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "StartHour",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "selected",
                schema: "Restaurant",
                table: "PromotionMenu");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EndHour",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StartHour",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "selected",
                schema: "Restaurant",
                table: "PromotionMenu",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
