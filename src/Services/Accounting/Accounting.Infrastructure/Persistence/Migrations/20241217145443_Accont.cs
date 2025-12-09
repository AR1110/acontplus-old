using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Accounting.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class Accont : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Account",
                schema: "Contabilidad",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParentAccountId = table.Column<int>(type: "int", nullable: true),
                    TipoId = table.Column<int>(type: "int", nullable: true),
                    Code = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    Hierarchy = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    Level = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Account", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Account_Account_ParentAccountId",
                        column: x => x.ParentAccountId,
                        principalSchema: "Contabilidad",
                        principalTable: "Account",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Account_Tipo_TipoId",
                        column: x => x.TipoId,
                        principalSchema: "Contabilidad",
                        principalTable: "Tipo",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Account_ParentAccountId",
                schema: "Contabilidad",
                table: "Account",
                column: "ParentAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Account_TipoId",
                schema: "Contabilidad",
                table: "Account",
                column: "TipoId");

            migrationBuilder.CreateIndex(
                name: "UI_Contabilidad_Accont_Code",
                schema: "Contabilidad",
                table: "Account",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Account",
                schema: "Contabilidad");
        }
    }
}
