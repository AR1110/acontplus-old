using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FactElect.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SriTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Sri");

            migrationBuilder.CreateTable(
                name: "FormaPago",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: false),
                    FechaInicio = table.Column<DateOnly>(type: "date", nullable: true),
                    FechaFin = table.Column<DateOnly>(type: "date", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormaPago", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ImpuestoRetencion",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "varchar(1)", unicode: false, maxLength: 1, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImpuestoRetencion", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pais",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pais", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PorcentajeRetencionIva",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Porcentaje = table.Column<decimal>(type: "numeric(6,2)", nullable: false),
                    FechaInicio = table.Column<DateOnly>(type: "date", nullable: true),
                    FechaFin = table.Column<DateOnly>(type: "date", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PorcentajeRetencionIva", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SustentoTributario",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    FechaInicio = table.Column<DateOnly>(type: "date", nullable: true),
                    FechaFin = table.Column<DateOnly>(type: "date", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SustentoTributario", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TipoComprobante",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    FechaVigencia = table.Column<DateOnly>(type: "date", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoComprobante", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TipoIdentificacionProveedor",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoIdentificacionProveedor", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TipoPago",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoPago", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TipoRegimenFiscalExterior",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoRegimenFiscalExterior", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ParaisoFiscal",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    FechaInicio = table.Column<DateOnly>(type: "date", nullable: true),
                    FechaFin = table.Column<DateOnly>(type: "date", nullable: true),
                    PaisId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParaisoFiscal", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ParaisoFiscal_Pais_PaisId",
                        column: x => x.PaisId,
                        principalSchema: "Sri",
                        principalTable: "Pais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DocumentoSustentoTributario",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TipoComprobanteId = table.Column<int>(type: "int", nullable: false),
                    SustentoTributarioId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentoSustentoTributario", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DocumentoSustentoTributario_SustentoTributario_SustentoTributarioId",
                        column: x => x.SustentoTributarioId,
                        principalSchema: "Sri",
                        principalTable: "SustentoTributario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DocumentoSustentoTributario_TipoComprobante_TipoComprobanteId",
                        column: x => x.TipoComprobanteId,
                        principalSchema: "Sri",
                        principalTable: "TipoComprobante",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ConceptoRetencionAir",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TipoPagoId = table.Column<int>(type: "int", nullable: false),
                    Codigo = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    Porcentaje = table.Column<decimal>(type: "numeric(6,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConceptoRetencionAir", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConceptoRetencionAir_TipoPago_TipoPagoId",
                        column: x => x.TipoPagoId,
                        principalSchema: "Sri",
                        principalTable: "TipoPago",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PorcentajeRetencionAir",
                schema: "Sri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FechaInicio = table.Column<DateOnly>(type: "date", nullable: true),
                    ConceptoRetencionAirId = table.Column<int>(type: "int", nullable: false),
                    Porcentaje = table.Column<decimal>(type: "numeric(6,2)", nullable: false),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PorcentajeRetencionAir", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PorcentajeRetencionAir_ConceptoRetencionAir_ConceptoRetencionAirId",
                        column: x => x.ConceptoRetencionAirId,
                        principalSchema: "Sri",
                        principalTable: "ConceptoRetencionAir",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConceptoRetencionAir_TipoPagoId",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                column: "TipoPagoId");

            migrationBuilder.CreateIndex(
                name: "UX_ConceptoRetencionAir_Codigo",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DocumentoSustentoTributario_SustentoTributarioId",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                column: "SustentoTributarioId");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentoSustentoTributario_TipoComprobanteId",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                column: "TipoComprobanteId");

            migrationBuilder.CreateIndex(
                name: "UX_ImpuestoRetencion_Codigo",
                schema: "Sri",
                table: "ImpuestoRetencion",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UX_Pais_Codigo",
                schema: "Sri",
                table: "Pais",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ParaisoFiscal_PaisId",
                schema: "Sri",
                table: "ParaisoFiscal",
                column: "PaisId");

            migrationBuilder.CreateIndex(
                name: "UX_ParaisoFiscal_Codigo",
                schema: "Sri",
                table: "ParaisoFiscal",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PorcentajeRetencionAir_ConceptoRetencionAirId",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                column: "ConceptoRetencionAirId");

            migrationBuilder.CreateIndex(
                name: "UX_PorcentajeRetencionIva_Codigo",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UX_SustentoTributario_Codigo",
                schema: "Sri",
                table: "SustentoTributario",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UX_TipoComprobante_Codigo",
                schema: "Sri",
                table: "TipoComprobante",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UX_TipoIdentificacionProveedor_Codigo",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UX_TipoPago_Codigo",
                schema: "Sri",
                table: "TipoPago",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UX_TipoRegimenFiscalExterior_Codigo",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                column: "Codigo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DocumentoSustentoTributario",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "FormaPago",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "ImpuestoRetencion",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "ParaisoFiscal",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "PorcentajeRetencionAir",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "PorcentajeRetencionIva",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "TipoIdentificacionProveedor",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "TipoRegimenFiscalExterior",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "SustentoTributario",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "TipoComprobante",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "Pais",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "ConceptoRetencionAir",
                schema: "Sri");

            migrationBuilder.DropTable(
                name: "TipoPago",
                schema: "Sri");
        }
    }
}
