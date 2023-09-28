using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vet.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AgeWeighMedicalHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "PetType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "PetType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "Pet",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "MedicalHistory",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<decimal>(
                name: "Age",
                schema: "Pet",
                table: "MedicalHistory",
                type: "numeric(4,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Weight",
                schema: "Pet",
                table: "MedicalHistory",
                type: "numeric(4,2)",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "HealthCheck",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "HealthCheck",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "Gender",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "Gender",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "DiseaseType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "DiseaseType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "DiseaseStatus",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "DiseaseStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "Disease",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "Disease",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "Breed",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "Breed",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "BehaviorTest",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "BehaviorTest",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "BehaviorStatus",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "BehaviorStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "Behavior",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Pet",
                table: "Behavior",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "UI_PetType",
                schema: "Pet",
                table: "PetType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_Gender",
                schema: "Pet",
                table: "Gender",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_DiseaseType",
                schema: "Pet",
                table: "DiseaseType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_DiseaseStatus",
                schema: "Pet",
                table: "DiseaseStatus",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_Disease",
                schema: "Pet",
                table: "Disease",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_Breed",
                schema: "Pet",
                table: "Breed",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_BehaviorStatus",
                schema: "Pet",
                table: "BehaviorStatus",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_Behavior",
                schema: "Pet",
                table: "Behavior",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UI_PetType",
                schema: "Pet",
                table: "PetType");

            migrationBuilder.DropIndex(
                name: "UI_Gender",
                schema: "Pet",
                table: "Gender");

            migrationBuilder.DropIndex(
                name: "UI_DiseaseType",
                schema: "Pet",
                table: "DiseaseType");

            migrationBuilder.DropIndex(
                name: "UI_DiseaseStatus",
                schema: "Pet",
                table: "DiseaseStatus");

            migrationBuilder.DropIndex(
                name: "UI_Disease",
                schema: "Pet",
                table: "Disease");

            migrationBuilder.DropIndex(
                name: "UI_Breed",
                schema: "Pet",
                table: "Breed");

            migrationBuilder.DropIndex(
                name: "UI_BehaviorStatus",
                schema: "Pet",
                table: "BehaviorStatus");

            migrationBuilder.DropIndex(
                name: "UI_Behavior",
                schema: "Pet",
                table: "Behavior");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "PetType");

            migrationBuilder.DropColumn(
                name: "Age",
                schema: "Pet",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "Weight",
                schema: "Pet",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "HealthCheck");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "Gender");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "DiseaseType");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "DiseaseStatus");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "Disease");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "Breed");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "BehaviorTest");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "BehaviorStatus");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Pet",
                table: "Behavior");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "PetType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "Pet",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "MedicalHistory",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "HealthCheck",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "Gender",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "DiseaseType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "DiseaseStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "Disease",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "Breed",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "BehaviorTest",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "BehaviorStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Pet",
                table: "Behavior",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);
        }
    }
}
