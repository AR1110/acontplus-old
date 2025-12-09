using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanical.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class DefaultValuesBaseColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehicleType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehiclePartType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehiclePart");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehicleCompany");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Vehicle");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportStatus");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportDocument");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportDetail");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Support");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Inspection");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehicleType",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Vehicle",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Support",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Inspection",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehicleType",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehicleType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Vehicle",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Vehicle",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Support",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Support",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "CreatedByUserId",
                schema: "Mechanical",
                table: "Inspection",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Mechanical",
                table: "Inspection",
                type: "rowversion",
                rowVersion: true,
                nullable: true);
        }
    }
}
