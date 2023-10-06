using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanical.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class MainenaceAlter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Maintenance_Inspection_InspectionId",
                schema: "Mechanical",
                table: "Maintenance");

            migrationBuilder.RenameColumn(
                name: "InspectionId",
                schema: "Mechanical",
                table: "Maintenance",
                newName: "SupportId");

            migrationBuilder.RenameIndex(
                name: "IX_Maintenance_InspectionId",
                schema: "Mechanical",
                table: "Maintenance",
                newName: "IX_Maintenance_SupportId");
            

            migrationBuilder.AddForeignKey(
                name: "FK_Maintenance_Support_SupportId",
                schema: "Mechanical",
                table: "Maintenance",
                column: "SupportId",
                principalSchema: "Mechanical",
                principalTable: "Support",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Maintenance_Support_SupportId",
                schema: "Mechanical",
                table: "Maintenance");

            migrationBuilder.RenameColumn(
                name: "SupportId",
                schema: "Mechanical",
                table: "Maintenance",
                newName: "InspectionId");

            migrationBuilder.RenameIndex(
                name: "IX_Maintenance_SupportId",
                schema: "Mechanical",
                table: "Maintenance",
                newName: "IX_Maintenance_InspectionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Maintenance_Inspection_InspectionId",
                schema: "Mechanical",
                table: "Maintenance",
                column: "InspectionId",
                principalSchema: "Mechanical",
                principalTable: "Inspection",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
