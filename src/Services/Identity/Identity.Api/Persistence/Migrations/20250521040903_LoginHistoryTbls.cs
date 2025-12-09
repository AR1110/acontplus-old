using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class LoginHistoryTbls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<DateTime>(
                name: "LoginDate",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETDATE()");

            migrationBuilder.AlterColumn<bool>(
                name: "IsLoggedIn",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: true,
                defaultValue: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ErrorDate",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: true,
                defaultValue: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "LoginHistoryArchive",
                schema: "Seguridad",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    UserRoleId = table.Column<int>(type: "int", nullable: false),
                    UserAgent = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    LoginDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsLoggedIn = table.Column<bool>(type: "bit", nullable: true),
                    IsLocked = table.Column<bool>(type: "bit", nullable: true),
                    IpAddress = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    Token = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    TokenExpiration = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoginHistoryArchive", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LoginHistoryArchive",
                schema: "Seguridad");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LoginDate",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<bool>(
                name: "IsLoggedIn",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "ErrorDate",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);
        }
    }
}
