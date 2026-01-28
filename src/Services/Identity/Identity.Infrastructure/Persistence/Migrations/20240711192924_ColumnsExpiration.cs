using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class ColumnsExpiration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TokenExpiration",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "TokenExpiration",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Seguridad",
                table: "AccessAuthorization");
        }
    }
}
