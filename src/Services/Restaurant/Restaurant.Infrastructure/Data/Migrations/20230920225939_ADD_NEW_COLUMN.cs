using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ADD_NEW_COLUMN : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndHour",
                schema: "Restaurant",
                table: "PromotionMenu");

            migrationBuilder.DropColumn(
                name: "StartHour",
                schema: "Restaurant",
                table: "PromotionMenu");
        }
    }
}
