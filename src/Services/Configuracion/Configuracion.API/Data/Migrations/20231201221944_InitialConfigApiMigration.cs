using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Configuracion.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialConfigApiMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Config");

            migrationBuilder.CreateTable(
                name: "PrinterType",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "varchar(3)", unicode: false, maxLength: 3, nullable: false),
                    Formato = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    DeviceInfo = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Thermal = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrinterType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Printer",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrinterTypeId = table.Column<int>(type: "int", nullable: false),
                    EstablecimientoId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    IpAddress = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false),
                    Machine = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    MacAddress = table.Column<string>(type: "varchar(17)", unicode: false, maxLength: 17, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Printer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Printer_PrinterType_PrinterTypeId",
                        column: x => x.PrinterTypeId,
                        principalSchema: "Config",
                        principalTable: "PrinterType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PrinterDocument",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrinterId = table.Column<int>(type: "int", nullable: false),
                    CodDoc = table.Column<string>(type: "varchar(3)", unicode: false, maxLength: 3, nullable: false),
                    Copies = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrinterDocument", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrinterDocument_Printer_PrinterId",
                        column: x => x.PrinterId,
                        principalSchema: "Config",
                        principalTable: "Printer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Printer_PrinterTypeId",
                schema: "Config",
                table: "Printer",
                column: "PrinterTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterDocument_PrinterId",
                schema: "Config",
                table: "PrinterDocument",
                column: "PrinterId");

            migrationBuilder.CreateIndex(
                name: "UI_PrinterType",
                schema: "Config",
                table: "PrinterType",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PrinterDocument",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "Printer",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "PrinterType",
                schema: "Config");
        }
    }
}
