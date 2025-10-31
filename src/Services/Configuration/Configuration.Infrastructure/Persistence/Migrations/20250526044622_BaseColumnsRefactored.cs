using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Configuration.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class BaseColumnsRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "PrinterType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "PrinterType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "PrinterType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Config",
                table: "PrinterType",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "PrinterType",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Config",
                table: "PrinterType",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Config",
                table: "PrinterType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Config",
                table: "PrinterType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "PrinterType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "PrinterType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "PrinterDocument",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "PrinterDocument",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "PrinterDocument",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Config",
                table: "PrinterDocument",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "PrinterDocument",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Config",
                table: "PrinterDocument",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Config",
                table: "PrinterDocument",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Config",
                table: "PrinterDocument",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "PrinterDocument",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "PrinterDocument",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "Printer",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "Printer",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "Printer",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Config",
                table: "Printer",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "Printer",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Config",
                table: "Printer",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Config",
                table: "Printer",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Config",
                table: "Printer",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "Printer",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "Printer",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "PrinterType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "PrinterType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "PrinterType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "PrinterDocument",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "PrinterDocument",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "PrinterDocument",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "Printer",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "Printer",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "Printer",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
