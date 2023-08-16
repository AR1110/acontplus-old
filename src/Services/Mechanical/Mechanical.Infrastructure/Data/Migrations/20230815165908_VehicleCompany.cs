using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanical.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class VehicleCompany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VehicleCompanys_Vehicle_VehicleId",
                table: "VehicleCompanys");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VehicleCompanys",
                table: "VehicleCompanys");

            migrationBuilder.RenameTable(
                name: "VehicleCompanys",
                newName: "VehicleCompany",
                newSchema: "Mechanical");

            migrationBuilder.RenameIndex(
                name: "IX_VehicleCompanys_VehicleId",
                schema: "Mechanical",
                table: "VehicleCompany",
                newName: "IX_VehicleCompany_VehicleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_VehicleCompany",
                schema: "Mechanical",
                table: "VehicleCompany",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VehicleCompany_Vehicle_VehicleId",
                schema: "Mechanical",
                table: "VehicleCompany",
                column: "VehicleId",
                principalSchema: "Mechanical",
                principalTable: "Vehicle",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VehicleCompany_Vehicle_VehicleId",
                schema: "Mechanical",
                table: "VehicleCompany");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VehicleCompany",
                schema: "Mechanical",
                table: "VehicleCompany");

            migrationBuilder.RenameTable(
                name: "VehicleCompany",
                schema: "Mechanical",
                newName: "VehicleCompanys");

            migrationBuilder.RenameIndex(
                name: "IX_VehicleCompany_VehicleId",
                table: "VehicleCompanys",
                newName: "IX_VehicleCompanys_VehicleId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_VehicleCompanys",
                table: "VehicleCompanys",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VehicleCompanys_Vehicle_VehicleId",
                table: "VehicleCompanys",
                column: "VehicleId",
                principalSchema: "Mechanical",
                principalTable: "Vehicle",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
