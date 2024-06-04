using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventario.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Inventario");

            migrationBuilder.CreateTable(
                name: "MotivoDiscrepancia",
                schema: "Inventario",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MotivoDiscrepancia", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StockFisico",
                schema: "Inventario",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CodEstab = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    PuntoEmisionId = table.Column<int>(type: "int", nullable: false),
                    Secuencial = table.Column<int>(type: "int", nullable: false),
                    SerieDocumento = table.Column<string>(type: "varchar(18)", unicode: false, maxLength: 18, nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Responsable = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    Obs = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    FechaRevision = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockFisico", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StockFisicoDetalle",
                schema: "Inventario",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StockFisicoId = table.Column<int>(type: "int", nullable: false),
                    BodegaId = table.Column<int>(type: "int", nullable: false),
                    ArticuloId = table.Column<int>(type: "int", nullable: false),
                    CantidadContada = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    StockActual = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    Discrepancia = table.Column<decimal>(type: "numeric(18,5)", nullable: true),
                    MotivoDiscrepanciaId = table.Column<int>(type: "int", nullable: true),
                    OtroMotivo = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockFisicoDetalle", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockFisicoDetalle_MotivoDiscrepancia_MotivoDiscrepanciaId",
                        column: x => x.MotivoDiscrepanciaId,
                        principalSchema: "Inventario",
                        principalTable: "MotivoDiscrepancia",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_StockFisicoDetalle_StockFisico_StockFisicoId",
                        column: x => x.StockFisicoId,
                        principalSchema: "Inventario",
                        principalTable: "StockFisico",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockFisicoDetalle_MotivoDiscrepanciaId",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                column: "MotivoDiscrepanciaId");

            migrationBuilder.CreateIndex(
                name: "IX_StockFisicoDetalle_StockFisicoId",
                schema: "Inventario",
                table: "StockFisicoDetalle",
                column: "StockFisicoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockFisicoDetalle",
                schema: "Inventario");

            migrationBuilder.DropTable(
                name: "MotivoDiscrepancia",
                schema: "Inventario");

            migrationBuilder.DropTable(
                name: "StockFisico",
                schema: "Inventario");
        }
    }
}
