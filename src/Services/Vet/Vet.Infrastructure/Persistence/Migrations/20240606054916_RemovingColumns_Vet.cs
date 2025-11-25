using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vet.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovingColumns_Vet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyId",
                schema: "Vet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                schema: "Vet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "CodEstab",
                schema: "Vet",
                table: "MedicalHistory");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                schema: "Vet",
                table: "Pet",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomerId",
                schema: "Vet",
                table: "Pet",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CodEstab",
                schema: "Vet",
                table: "MedicalHistory",
                type: "varchar(15)",
                unicode: false,
                maxLength: 15,
                nullable: true);
        }
    }
}
