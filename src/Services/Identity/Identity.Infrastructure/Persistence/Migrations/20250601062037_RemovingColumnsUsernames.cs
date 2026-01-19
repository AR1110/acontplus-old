using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovingColumnsUsernames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "Username",
                schema: "Seguridad",
                table: "LoginHistory");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Username",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Username",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);
        }
    }
}
