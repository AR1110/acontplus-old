using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class TablesUpdateV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "capacity",
                schema: "Restaurant",
                table: "Table",
                newName: "Capacity");

            migrationBuilder.RenameColumn(
                name: "code",
                schema: "Restaurant",
                table: "Room",
                newName: "Code");

            migrationBuilder.RenameColumn(
                name: "capacity",
                schema: "Restaurant",
                table: "Room",
                newName: "Capacity");

            migrationBuilder.RenameColumn(
                name: "descripction",
                schema: "Restaurant",
                table: "Room",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "description",
                schema: "Restaurant",
                table: "Floor",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "code",
                schema: "Restaurant",
                table: "Floor",
                newName: "Code");

            migrationBuilder.RenameColumn(
                name: "capacity",
                schema: "Restaurant",
                table: "Floor",
                newName: "Capacity");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Capacity",
                schema: "Restaurant",
                table: "Table",
                newName: "capacity");

            migrationBuilder.RenameColumn(
                name: "Code",
                schema: "Restaurant",
                table: "Room",
                newName: "code");

            migrationBuilder.RenameColumn(
                name: "Capacity",
                schema: "Restaurant",
                table: "Room",
                newName: "capacity");

            migrationBuilder.RenameColumn(
                name: "Description",
                schema: "Restaurant",
                table: "Room",
                newName: "descripction");

            migrationBuilder.RenameColumn(
                name: "Description",
                schema: "Restaurant",
                table: "Floor",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Code",
                schema: "Restaurant",
                table: "Floor",
                newName: "code");

            migrationBuilder.RenameColumn(
                name: "Capacity",
                schema: "Restaurant",
                table: "Floor",
                newName: "capacity");
        }
    }
}
