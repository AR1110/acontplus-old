using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class IpColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ErrorDaate",
                schema: "Seguridad",
                table: "LoginFailed",
                newName: "ErrorDate");

            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "varchar(15)",
                unicode: false,
                maxLength: 15,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "varchar(15)",
                unicode: false,
                maxLength: 15,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IpAddress",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "IpAddress",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.RenameColumn(
                name: "ErrorDate",
                schema: "Seguridad",
                table: "LoginFailed",
                newName: "ErrorDaate");
        }
    }
}
