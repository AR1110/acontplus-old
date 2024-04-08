using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventario.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProductPhoto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Inventario",
                table: "StockFisico",
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

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Inventario",
                table: "MotivoDiscrepancia",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProductPhoto",
                schema: "Inventario",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    S3ObjectKey = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
                    S3ObjectUrl = table.Column<string>(type: "varchar(800)", unicode: false, maxLength: 800, nullable: false),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPhoto", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductPhoto",
                schema: "Inventario");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Inventario",
                table: "StockFisicoDetalle");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Inventario",
                table: "MotivoDiscrepancia");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
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
                table: "MotivoDiscrepancia",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);
        }
    }
}
