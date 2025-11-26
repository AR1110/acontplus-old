using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanical.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class BaseColumnsRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehicleType",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "VehicleType",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "VehicleType",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehicleType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "VehicleType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Vehicle",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "Vehicle",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "Vehicle",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Vehicle",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "Vehicle",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Support",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "Support",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "Support",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Support",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "Support",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Inspection",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "Inspection",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "Inspection",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Inspection",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "Inspection",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehicleType");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "VehicleType");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "VehicleType");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehicleType");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "VehicleType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehicleType");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "VehicleType");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehiclePartType");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "VehiclePartType");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "VehiclePartType");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehiclePartType");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "VehiclePartType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehiclePartType");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "VehiclePartType");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehiclePart");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "VehiclePart");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "VehiclePart");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehiclePart");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "VehiclePart");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehiclePart");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "VehiclePart");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehicleCompany");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "VehicleCompany");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "VehicleCompany");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehicleCompany");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "VehicleCompany");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehicleCompany");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "VehicleCompany");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Vehicle");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "Vehicle");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "Vehicle");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Mechanical",
                table: "Vehicle");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "Vehicle");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Vehicle");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "Vehicle");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportStatus");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "SupportStatus");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "SupportStatus");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportStatus");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "SupportStatus");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportStatus");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "SupportStatus");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportDocument");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "SupportDocument");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "SupportDocument");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportDocument");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "SupportDocument");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportDocument");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "SupportDocument");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportDetail");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "SupportDetail");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "SupportDetail");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportDetail");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "SupportDetail");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportDetail");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "SupportDetail");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Support");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "Support");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "Support");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Mechanical",
                table: "Support");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "Support");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Support");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "Support");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Inspection");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Mechanical",
                table: "Inspection");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Mechanical",
                table: "Inspection");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Mechanical",
                table: "Inspection");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Mechanical",
                table: "Inspection");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Inspection");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Mechanical",
                table: "Inspection");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
