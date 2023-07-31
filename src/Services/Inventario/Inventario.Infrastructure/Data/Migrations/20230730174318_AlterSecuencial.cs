using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventario.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AlterSecuencial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockFisicoDetalle_MotivoDiscrepancia_MotivoDiscrepanciaId",
                schema: "Inventario",
                table: "StockFisicoDetalle");

            migrationBuilder.AlterColumn<int>(
                name: "MotivoDiscrepanciaId",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "Discrepancia",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "numeric(18,5)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)");

            migrationBuilder.AlterColumn<long>(
                name: "Secuencial",
                schema: "Inventario",
                table: "StockFisico",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(15)",
                oldUnicode: false,
                oldMaxLength: 15);

            migrationBuilder.AddColumn<string>(
                name: "SerieDocumento",
                schema: "Inventario",
                table: "StockFisico",
                type: "varchar(18)",
                unicode: false,
                maxLength: 18,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_StockFisicoDetalle_MotivoDiscrepancia_MotivoDiscrepanciaId",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                column: "MotivoDiscrepanciaId",
                principalSchema: "Inventario",
                principalTable: "MotivoDiscrepancia",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockFisicoDetalle_MotivoDiscrepancia_MotivoDiscrepanciaId",
                schema: "Inventario",
                table: "StockFisicoDetalle");

            migrationBuilder.DropColumn(
                name: "SerieDocumento",
                schema: "Inventario",
                table: "StockFisico");

            migrationBuilder.AlterColumn<int>(
                name: "MotivoDiscrepanciaId",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Discrepancia",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,5)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Secuencial",
                schema: "Inventario",
                table: "StockFisico",
                type: "varchar(15)",
                unicode: false,
                maxLength: 15,
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddForeignKey(
                name: "FK_StockFisicoDetalle_MotivoDiscrepancia_MotivoDiscrepanciaId",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                column: "MotivoDiscrepanciaId",
                principalSchema: "Inventario",
                principalTable: "MotivoDiscrepancia",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
