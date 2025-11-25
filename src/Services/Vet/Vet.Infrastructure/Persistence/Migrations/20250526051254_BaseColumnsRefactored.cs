using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vet.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class BaseColumnsRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "UQ_PetType_Code",
                schema: "Vet",
                table: "PetType",
                newName: "UX_PetType_Code");

            migrationBuilder.RenameIndex(
                name: "UQ_Gender_Code",
                schema: "Vet",
                table: "Gender",
                newName: "UX_Gender_Code");

            migrationBuilder.RenameIndex(
                name: "UQ_DiseaseType_Code",
                schema: "Vet",
                table: "DiseaseType",
                newName: "UX_DiseaseType_Code");

            migrationBuilder.RenameIndex(
                name: "UQ_DiseaseStatus_Code",
                schema: "Vet",
                table: "DiseaseStatus",
                newName: "UX_DiseaseStatus_Code");

            migrationBuilder.RenameIndex(
                name: "UQ_Disease_Code",
                schema: "Vet",
                table: "Disease",
                newName: "UX_Disease_Code");

            migrationBuilder.RenameIndex(
                name: "UQ_Breed_Code",
                schema: "Vet",
                table: "Breed",
                newName: "UX_Breed_Code");

            migrationBuilder.RenameIndex(
                name: "UQ_BehaviorStatus_Code",
                schema: "Vet",
                table: "BehaviorStatus",
                newName: "UX_BehaviorStatus_Code");

            migrationBuilder.RenameIndex(
                name: "UQ_Behavior_Code",
                schema: "Vet",
                table: "Behavior",
                newName: "UX_Behavior_Code");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "PetType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "PetType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "PetType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "PetType",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "PetType",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "PetType",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "PetType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "PetType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "PetType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "PetType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Pet",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "Pet",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "Pet",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "Pet",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "Pet",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "Pet",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "Pet",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "Pet",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "Pet",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "Pet",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "MedicalHistory",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "MedicalHistory",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "MedicalHistory",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "MedicalHistory",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "MedicalHistory",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "MedicalHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "MedicalHistory",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "MedicalHistory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "MedicalHistory",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "MedicalHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "HealthCheck",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "HealthCheck",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "HealthCheck",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "HealthCheck",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "HealthCheck",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "HealthCheck",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "HealthCheck",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "HealthCheck",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "HealthCheck",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "HealthCheck",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Gender",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "Gender",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "Gender",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "Gender",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "Gender",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "Gender",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "Gender",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "Gender",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "Gender",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "Gender",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "DiseaseType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "DiseaseType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "DiseaseType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "DiseaseType",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "DiseaseType",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "DiseaseType",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "DiseaseType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "DiseaseType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "DiseaseType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "DiseaseType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Disease",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "Disease",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "Disease",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "Disease",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "Disease",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "Disease",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "Disease",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "Disease",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "Disease",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "Disease",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Breed",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "Breed",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "Breed",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "Breed",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "Breed",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "Breed",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "Breed",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "Breed",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "Breed",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "Breed",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "BehaviorTest",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "BehaviorTest",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "BehaviorTest",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "BehaviorTest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "BehaviorTest",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "BehaviorTest",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "BehaviorTest",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "BehaviorTest",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "BehaviorTest",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "BehaviorTest",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Behavior",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "Behavior",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "Behavior",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "Behavior",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Vet",
                table: "Behavior",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "Behavior",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Vet",
                table: "Behavior",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Vet",
                table: "Behavior",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Vet",
                table: "Behavior",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "Behavior",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "PetType");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "PetType");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "PetType");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "PetType");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "PetType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "PetType");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "PetType");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "HealthCheck");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "HealthCheck");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "HealthCheck");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "HealthCheck");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "HealthCheck");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "HealthCheck");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "HealthCheck");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "Gender");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "Gender");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "Gender");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "Gender");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "Gender");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "Gender");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "Gender");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "DiseaseType");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "DiseaseType");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "DiseaseType");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "DiseaseType");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "DiseaseType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "DiseaseType");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "DiseaseType");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "DiseaseStatus");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "DiseaseStatus");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "DiseaseStatus");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "DiseaseStatus");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "DiseaseStatus");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "DiseaseStatus");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "DiseaseStatus");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "Disease");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "Disease");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "Disease");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "Disease");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "Disease");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "Disease");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "Disease");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "Breed");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "Breed");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "Breed");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "Breed");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "Breed");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "Breed");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "Breed");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "BehaviorTest");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "BehaviorTest");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "BehaviorTest");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "BehaviorTest");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "BehaviorTest");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "BehaviorTest");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "BehaviorTest");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "BehaviorStatus");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "BehaviorStatus");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "BehaviorStatus");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "BehaviorStatus");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "BehaviorStatus");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "BehaviorStatus");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "BehaviorStatus");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Vet",
                table: "Behavior");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Vet",
                table: "Behavior");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Vet",
                table: "Behavior");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Vet",
                table: "Behavior");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Vet",
                table: "Behavior");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Vet",
                table: "Behavior");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Vet",
                table: "Behavior");

            migrationBuilder.RenameIndex(
                name: "UX_PetType_Code",
                schema: "Vet",
                table: "PetType",
                newName: "UQ_PetType_Code");

            migrationBuilder.RenameIndex(
                name: "UX_Gender_Code",
                schema: "Vet",
                table: "Gender",
                newName: "UQ_Gender_Code");

            migrationBuilder.RenameIndex(
                name: "UX_DiseaseType_Code",
                schema: "Vet",
                table: "DiseaseType",
                newName: "UQ_DiseaseType_Code");

            migrationBuilder.RenameIndex(
                name: "UX_DiseaseStatus_Code",
                schema: "Vet",
                table: "DiseaseStatus",
                newName: "UQ_DiseaseStatus_Code");

            migrationBuilder.RenameIndex(
                name: "UX_Disease_Code",
                schema: "Vet",
                table: "Disease",
                newName: "UQ_Disease_Code");

            migrationBuilder.RenameIndex(
                name: "UX_Breed_Code",
                schema: "Vet",
                table: "Breed",
                newName: "UQ_Breed_Code");

            migrationBuilder.RenameIndex(
                name: "UX_BehaviorStatus_Code",
                schema: "Vet",
                table: "BehaviorStatus",
                newName: "UQ_BehaviorStatus_Code");

            migrationBuilder.RenameIndex(
                name: "UX_Behavior_Code",
                schema: "Vet",
                table: "Behavior",
                newName: "UQ_Behavior_Code");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "PetType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "PetType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "PetType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Pet",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "Pet",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "Pet",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "MedicalHistory",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "MedicalHistory",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "MedicalHistory",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "HealthCheck",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "HealthCheck",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "HealthCheck",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Gender",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "Gender",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "Gender",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "DiseaseType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "DiseaseType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "DiseaseType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "DiseaseStatus",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Disease",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "Disease",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "Disease",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Breed",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "Breed",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "Breed",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "BehaviorTest",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "BehaviorTest",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "BehaviorTest",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "BehaviorStatus",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Vet",
                table: "Behavior",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Vet",
                table: "Behavior",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Vet",
                table: "Behavior",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
