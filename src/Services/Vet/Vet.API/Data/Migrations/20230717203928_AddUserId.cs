using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vet.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "Pet",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "MedicalHistory",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "MedicalHistory");
        }
    }
}
