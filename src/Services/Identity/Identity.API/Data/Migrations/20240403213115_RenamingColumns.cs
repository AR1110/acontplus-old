using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class RenamingColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyId",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.RenameColumn(
                name: "SeceiverId",
                schema: "Seguridad",
                table: "AccessAuthorization",
                newName: "ReceiverId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReceiverId",
                schema: "Seguridad",
                table: "AccessAuthorization",
                newName: "SeceiverId");

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
