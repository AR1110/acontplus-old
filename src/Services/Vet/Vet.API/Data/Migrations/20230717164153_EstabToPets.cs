using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vet.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class EstabToPets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CodEstab",
                schema: "Pet",
                table: "Pet",
                type: "varchar(15)",
                unicode: false,
                maxLength: 15,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CodEstab",
                schema: "Pet",
                table: "MedicalHistory",
                type: "varchar(15)",
                unicode: false,
                maxLength: 15,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CodEstab",
                schema: "Pet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "CodEstab",
                schema: "Pet",
                table: "MedicalHistory");
        }
    }
}
