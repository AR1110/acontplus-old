using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class BaseColumnsRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
