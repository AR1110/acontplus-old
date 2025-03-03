using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FactElect.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class RecreateCustomerIdIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "UXC_Customer_IdCard",
                schema: "Customer",
                table: "Customer",
                column: "IdCard",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UXC_Customer_IdCard",
                schema: "Customer",
                table: "Customer");
        }
    }
}
