using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanical.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Mechanical");

            migrationBuilder.CreateTable(
                name: "VehiclePartType",
                schema: "Mechanical",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    Description = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehiclePartType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VehicleType",
                schema: "Mechanical",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(8)", unicode: false, maxLength: 8, nullable: false),
                    Description = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VehiclePart",
                schema: "Mechanical",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VehiclePartTypeId = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    Description = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehiclePart", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VehiclePart_VehiclePartType_VehiclePartTypeId",
                        column: x => x.VehiclePartTypeId,
                        principalSchema: "Mechanical",
                        principalTable: "VehiclePartType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vehicle",
                schema: "Mechanical",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VehicleTypeId = table.Column<int>(type: "int", nullable: false),
                    CountryId = table.Column<int>(type: "int", nullable: false),
                    LicensePlate = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Brand = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Model = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Color = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Engine = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Chassis = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    Cylindraje = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicle", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vehicle_VehicleType_VehicleTypeId",
                        column: x => x.VehicleTypeId,
                        principalSchema: "Mechanical",
                        principalTable: "VehicleType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VehicleCompany",
                schema: "Mechanical",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VehicleId = table.Column<int>(type: "int", nullable: false),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    Observation = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleCompany", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VehicleCompany_Vehicle_VehicleId",
                        column: x => x.VehicleId,
                        principalSchema: "Mechanical",
                        principalTable: "Vehicle",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Support",
                schema: "Mechanical",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PuntoEmisionId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false),
                    VehicleCompanyId = table.Column<int>(type: "int", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    Obs = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    UserAssignedId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Support", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Support_VehicleCompany_VehicleCompanyId",
                        column: x => x.VehicleCompanyId,
                        principalSchema: "Mechanical",
                        principalTable: "VehicleCompany",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Support_VehicleCompanyId",
                schema: "Mechanical",
                table: "Support",
                column: "VehicleCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicle_VehicleTypeId",
                schema: "Mechanical",
                table: "Vehicle",
                column: "VehicleTypeId");

            migrationBuilder.CreateIndex(
                name: "UXC_Mechanical_LicensePlate",
                schema: "Mechanical",
                table: "Vehicle",
                column: "LicensePlate",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VehicleCompany_VehicleId",
                schema: "Mechanical",
                table: "VehicleCompany",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_VehiclePart_VehiclePartTypeId",
                schema: "Mechanical",
                table: "VehiclePart",
                column: "VehiclePartTypeId");

            migrationBuilder.CreateIndex(
                name: "UXC_VehiclePart_Code",
                schema: "Mechanical",
                table: "VehiclePart",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UXC_VehiclePartType_Code",
                schema: "Mechanical",
                table: "VehiclePartType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UXC_Mechanical_Code",
                schema: "Mechanical",
                table: "VehicleType",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Support",
                schema: "Mechanical");

            migrationBuilder.DropTable(
                name: "VehiclePart",
                schema: "Mechanical");

            migrationBuilder.DropTable(
                name: "VehicleCompany",
                schema: "Mechanical");

            migrationBuilder.DropTable(
                name: "VehiclePartType",
                schema: "Mechanical");

            migrationBuilder.DropTable(
                name: "Vehicle",
                schema: "Mechanical");

            migrationBuilder.DropTable(
                name: "VehicleType",
                schema: "Mechanical");
        }
    }
}
