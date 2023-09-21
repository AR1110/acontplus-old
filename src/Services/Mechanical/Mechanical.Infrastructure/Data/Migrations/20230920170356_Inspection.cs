using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanical.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Inspection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Inspection",
                schema: "Mechanical",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupportId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Mileage = table.Column<int>(type: "int", nullable: false),
                    FuelLevel = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Engine = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Cabin = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Bearing = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Transmission = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Lighting = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Brake = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Steering = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Suspension = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Obs = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inspection", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inspection_Support_SupportId",
                        column: x => x.SupportId,
                        principalSchema: "Mechanical",
                        principalTable: "Support",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Inspection_SupportId",
                schema: "Mechanical",
                table: "Inspection",
                column: "SupportId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Inspection",
                schema: "Mechanical");
        }
    }
}
