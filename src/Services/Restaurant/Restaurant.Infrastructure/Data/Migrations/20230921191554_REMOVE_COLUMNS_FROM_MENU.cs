using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class REMOVE_COLUMNS_FROM_MENU : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndDate",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "PromotionDays",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "StartDate",
                schema: "Restaurant",
                table: "Menu");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                schema: "Restaurant",
                table: "Menu",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PromotionDays",
                schema: "Restaurant",
                table: "Menu",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                schema: "Restaurant",
                table: "Menu",
                type: "datetime2",
                nullable: true);
        }
    }
}
