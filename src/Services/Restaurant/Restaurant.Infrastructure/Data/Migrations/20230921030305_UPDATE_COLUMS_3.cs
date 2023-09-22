using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UPDATE_COLUMS_3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "promotionDays",
                schema: "Restaurant",
                table: "Promotion",
                newName: "PromotionDays");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PromotionDays",
                schema: "Restaurant",
                table: "Promotion",
                newName: "promotionDays");
        }
    }
}
