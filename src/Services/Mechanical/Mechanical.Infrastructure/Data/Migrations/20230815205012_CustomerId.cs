using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanical.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class CustomerId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CustonerId",
                schema: "Mechanical",
                table: "VehicleCompany",
                newName: "CustomerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CustomerId",
                schema: "Mechanical",
                table: "VehicleCompany",
                newName: "CustonerId");
        }
    }
}
