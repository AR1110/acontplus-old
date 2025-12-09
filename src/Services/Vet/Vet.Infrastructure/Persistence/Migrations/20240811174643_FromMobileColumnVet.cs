using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vet.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class FromMobileColumnVet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "PetType",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Pet",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "MedicalHistory",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "HealthCheck",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Gender",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "DiseaseType",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Disease",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Breed",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "BehaviorTest",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Behavior",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "PetType");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "HealthCheck");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "Gender");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "DiseaseType");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "DiseaseStatus");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "Disease");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "Breed");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "BehaviorTest");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "BehaviorStatus");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Vet",
                table: "Behavior");
        }
    }
}
