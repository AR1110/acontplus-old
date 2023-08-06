using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Contabilidad.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SubCategoria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SubCategoria",
                schema: "Contabilidad",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TipoId = table.Column<int>(type: "int", nullable: false),
                    CategoriaId = table.Column<int>(type: "int", nullable: false),
                    Codigo = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Descripcion = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: true),
                    IdEntidad = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubCategoria", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubCategoria_Categoria_CategoriaId",
                        column: x => x.CategoriaId,
                        principalSchema: "Contabilidad",
                        principalTable: "Categoria",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SubCategoria_Tipo_TipoId",
                        column: x => x.TipoId,
                        principalSchema: "Contabilidad",
                        principalTable: "Tipo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SubCategoria_CategoriaId",
                schema: "Contabilidad",
                table: "SubCategoria",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_SubCategoria_TipoId",
                schema: "Contabilidad",
                table: "SubCategoria",
                column: "TipoId");

            migrationBuilder.CreateIndex(
                name: "UXSC_CContabilidad_Codigo",
                schema: "Contabilidad",
                table: "SubCategoria",
                column: "Codigo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SubCategoria",
                schema: "Contabilidad");
        }
    }
}
