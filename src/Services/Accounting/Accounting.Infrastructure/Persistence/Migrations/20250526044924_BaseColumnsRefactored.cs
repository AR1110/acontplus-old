using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class BaseColumnsRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Tipo",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Contabilidad",
                table: "Tipo",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Contabilidad",
                table: "Tipo",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Contabilidad",
                table: "Tipo",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Contabilidad",
                table: "Tipo",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Contabilidad",
                table: "Tipo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Contabilidad",
                table: "Tipo",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Contabilidad",
                table: "Tipo",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Contabilidad",
                table: "Tipo",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Contabilidad",
                table: "Tipo",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Contabilidad",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Contabilidad",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Contabilidad",
                table: "Category",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Contabilidad",
                table: "Category",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Contabilidad",
                table: "Category",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Contabilidad",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Contabilidad",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Contabilidad",
                table: "Category",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Contabilidad",
                table: "Category",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Account",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Contabilidad",
                table: "Account",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Contabilidad",
                table: "Account",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Contabilidad",
                table: "Account",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Contabilidad",
                table: "Account",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Contabilidad",
                table: "Account",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Contabilidad",
                table: "Account",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Contabilidad",
                table: "Account",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Contabilidad",
                table: "Account",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Contabilidad",
                table: "Account",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Contabilidad",
                table: "Tipo");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Contabilidad",
                table: "Tipo");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Contabilidad",
                table: "Tipo");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Contabilidad",
                table: "Tipo");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Contabilidad",
                table: "Tipo");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Contabilidad",
                table: "Tipo");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Contabilidad",
                table: "Tipo");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Contabilidad",
                table: "Subcategory");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Contabilidad",
                table: "Subcategory");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Contabilidad",
                table: "Subcategory");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Contabilidad",
                table: "Subcategory");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Contabilidad",
                table: "Subcategory");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Contabilidad",
                table: "Subcategory");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Contabilidad",
                table: "Subcategory");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Contabilidad",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Contabilidad",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Contabilidad",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Contabilidad",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Contabilidad",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Contabilidad",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Contabilidad",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Contabilidad",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Contabilidad",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Contabilidad",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Contabilidad",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Contabilidad",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Contabilidad",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Contabilidad",
                table: "Account");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Tipo",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Contabilidad",
                table: "Tipo",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Contabilidad",
                table: "Tipo",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Contabilidad",
                table: "Subcategory",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Category",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Contabilidad",
                table: "Category",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Contabilidad",
                table: "Category",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Contabilidad",
                table: "Account",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Contabilidad",
                table: "Account",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Contabilidad",
                table: "Account",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
