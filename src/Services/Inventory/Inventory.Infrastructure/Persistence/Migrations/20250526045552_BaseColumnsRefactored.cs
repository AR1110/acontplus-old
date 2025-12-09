using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventory.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class BaseColumnsRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "StockFisico",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "StockFisico",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Inventario",
                table: "StockFisico",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Inventario",
                table: "StockFisico",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Inventario",
                table: "StockFisico",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Inventario",
                table: "StockFisico",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Inventario",
                table: "StockFisico",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Inventario",
                table: "StockFisico",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Inventario",
                table: "StockFisico",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Inventario",
                table: "StockFisico",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Inventario",
                table: "SubcategoryPhoto");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Inventario",
                table: "SubcategoryPhoto");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Inventario",
                table: "SubcategoryPhoto");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Inventario",
                table: "SubcategoryPhoto");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Inventario",
                table: "SubcategoryPhoto");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Inventario",
                table: "SubcategoryPhoto");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Inventario",
                table: "SubcategoryPhoto");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Inventario",
                table: "StockFisicoDetalle");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Inventario",
                table: "StockFisicoDetalle");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Inventario",
                table: "StockFisicoDetalle");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Inventario",
                table: "StockFisicoDetalle");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Inventario",
                table: "StockFisicoDetalle");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Inventario",
                table: "StockFisicoDetalle");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Inventario",
                table: "StockFisicoDetalle");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Inventario",
                table: "StockFisico");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Inventario",
                table: "StockFisico");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Inventario",
                table: "StockFisico");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Inventario",
                table: "StockFisico");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Inventario",
                table: "StockFisico");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Inventario",
                table: "StockFisico");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Inventario",
                table: "StockFisico");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Inventario",
                table: "ProductPhoto");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Inventario",
                table: "ProductPhoto");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Inventario",
                table: "ProductPhoto");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Inventario",
                table: "ProductPhoto");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Inventario",
                table: "ProductPhoto");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Inventario",
                table: "ProductPhoto");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Inventario",
                table: "ProductPhoto");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Inventario",
                table: "MotivoDiscrepancia");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Inventario",
                table: "MotivoDiscrepancia");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Inventario",
                table: "MotivoDiscrepancia");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Inventario",
                table: "MotivoDiscrepancia");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Inventario",
                table: "MotivoDiscrepancia");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Inventario",
                table: "MotivoDiscrepancia");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Inventario",
                table: "MotivoDiscrepancia");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Inventario",
                table: "SubcategoryPhoto",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "StockFisico",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "StockFisico",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Inventario",
                table: "StockFisico",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Inventario",
                table: "ProductPhoto",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
