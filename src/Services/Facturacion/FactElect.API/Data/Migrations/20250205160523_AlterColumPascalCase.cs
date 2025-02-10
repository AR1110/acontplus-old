using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FactElect.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AlterColumPascalCase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IDTypeId",
                schema: "Customer",
                table: "Customer",
                newName: "IdTypeId");

            migrationBuilder.RenameColumn(
                name: "IDCard",
                schema: "Customer",
                table: "Customer",
                newName: "IdCard");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IdTypeId",
                schema: "Customer",
                table: "Customer",
                newName: "IDTypeId");

            migrationBuilder.RenameColumn(
                name: "IdCard",
                schema: "Customer",
                table: "Customer",
                newName: "IDCard");
        }
    }
}
