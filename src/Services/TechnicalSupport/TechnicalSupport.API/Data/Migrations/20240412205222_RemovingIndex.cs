using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechnicalSupport.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovingIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UI_TS_DC_DeviceId",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceCustomer_DeviceId",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                column: "DeviceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DeviceCustomer_DeviceId",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.CreateIndex(
                name: "UI_TS_DC_DeviceId",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                column: "DeviceId",
                unique: true);
        }
    }
}
