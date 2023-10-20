using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class LoginHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Seguridad");

            migrationBuilder.CreateTable(
                name: "LoginFailed",
                schema: "Seguridad",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Password = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    UserAgent = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ErrorDaate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoginFailed", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LoginHistory",
                schema: "Seguridad",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Username = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    UserRoleId = table.Column<int>(type: "int", nullable: false),
                    UserAgent = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    LoginDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    IsLoggedIn = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    IsLocked = table.Column<bool>(type: "bit", nullable: true),
                    Token = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoginHistory", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LoginFailed",
                schema: "Seguridad");

            migrationBuilder.DropTable(
                name: "LoginHistory",
                schema: "Seguridad");
        }
    }
}
