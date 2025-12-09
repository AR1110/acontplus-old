using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class Accounting_Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Contabilidad");

            migrationBuilder.CreateTable(
                name: "Tipo",
                schema: "Contabilidad",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tipo", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                schema: "Contabilidad",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TipoId = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Category_Tipo_TipoId",
                        column: x => x.TipoId,
                        principalSchema: "Contabilidad",
                        principalTable: "Tipo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Subcategory",
                schema: "Contabilidad",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subcategory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subcategory_Category_CategoryId",
                        column: x => x.CategoryId,
                        principalSchema: "Contabilidad",
                        principalTable: "Category",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Category_TipoId",
                schema: "Contabilidad",
                table: "Category",
                column: "TipoId");

            migrationBuilder.CreateIndex(
                name: "UI_Contabilidad_Category_Code",
                schema: "Contabilidad",
                table: "Category",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subcategory_CategoryId",
                schema: "Contabilidad",
                table: "Subcategory",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "UI_Contabilidad_Tipo_Code",
                schema: "Contabilidad",
                table: "Tipo",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Subcategory",
                schema: "Contabilidad");

            migrationBuilder.DropTable(
                name: "Category",
                schema: "Contabilidad");

            migrationBuilder.DropTable(
                name: "Tipo",
                schema: "Contabilidad");
        }
    }
}
