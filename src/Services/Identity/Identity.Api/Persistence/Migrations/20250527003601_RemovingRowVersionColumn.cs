using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovingRowVersionColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Seguridad",
                table: "AccessAuthorization");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "rowversion",
                rowVersion: true,
                nullable: true);
        }
    }
}
