using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanical.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class REMOVE_TABLE_ADD_NEW_TABLE_SUPPORT : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MaintenanceDetail",
                schema: "Mechanical");

            migrationBuilder.DropTable(
                name: "Maintenance",
                schema: "Mechanical");

            migrationBuilder.CreateTable(
                name: "SupportDetail",
                schema: "Mechanical",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupportId = table.Column<int>(type: "int", nullable: false),
                    ArticuloId = table.Column<int>(type: "int", nullable: false),
                    TarifaId = table.Column<int>(type: "int", nullable: false),
                    BodegaId = table.Column<int>(type: "int", nullable: false),
                    MedidaId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    Quantity = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    Price = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    Cost = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    Total = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    CodePercentage = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Percentage = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    Obs = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupportDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SupportDetail_Support_SupportId",
                        column: x => x.SupportId,
                        principalSchema: "Mechanical",
                        principalTable: "Support",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SupportDetail_SupportId",
                schema: "Mechanical",
                table: "SupportDetail",
                column: "SupportId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SupportDetail",
                schema: "Mechanical");

            migrationBuilder.CreateTable(
                name: "Maintenance",
                schema: "Mechanical",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupportId = table.Column<int>(type: "int", nullable: false),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateEnd = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true),
                    Obs = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Maintenance", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Maintenance_Support_SupportId",
                        column: x => x.SupportId,
                        principalSchema: "Mechanical",
                        principalTable: "Support",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MaintenanceDetail",
                schema: "Mechanical",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaintenanceId = table.Column<int>(type: "int", nullable: false),
                    ArticuloId = table.Column<int>(type: "int", nullable: false),
                    BodegaId = table.Column<int>(type: "int", nullable: false),
                    CodePercentage = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Cost = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    Description = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    Enabled = table.Column<bool>(type: "bit", nullable: true),
                    MedidaId = table.Column<int>(type: "int", nullable: false),
                    Obs = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: true),
                    Percentage = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    Price = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    Quantity = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    TarifaId = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MaintenanceDetail_Maintenance_MaintenanceId",
                        column: x => x.MaintenanceId,
                        principalSchema: "Mechanical",
                        principalTable: "Maintenance",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Maintenance_SupportId",
                schema: "Mechanical",
                table: "Maintenance",
                column: "SupportId");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceDetail_MaintenanceId",
                schema: "Mechanical",
                table: "MaintenanceDetail",
                column: "MaintenanceId");
        }
    }
}
