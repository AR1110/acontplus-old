using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class BaseColumnsRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "Status",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Status",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Status",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Common",
                table: "Status",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Status",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Common",
                table: "Status",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Common",
                table: "Status",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Common",
                table: "Status",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "Status",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "Status",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "Priority",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Priority",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Priority",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Common",
                table: "Priority",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Priority",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Common",
                table: "Priority",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Common",
                table: "Priority",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Common",
                table: "Priority",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "Priority",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "Priority",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "NotificationType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "NotificationType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "NotificationType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Common",
                table: "NotificationType",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "NotificationType",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Common",
                table: "NotificationType",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Common",
                table: "NotificationType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Common",
                table: "NotificationType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "NotificationType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "NotificationType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "Notification",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Notification",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Notification",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Common",
                table: "Notification",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Notification",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Common",
                table: "Notification",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Common",
                table: "Notification",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Common",
                table: "Notification",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "Notification",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "Notification",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "MaritalStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "MaritalStatus",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "MaritalStatus",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Common",
                table: "MaritalStatus",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "MaritalStatus",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Common",
                table: "MaritalStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Common",
                table: "MaritalStatus",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Common",
                table: "MaritalStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "MaritalStatus",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "MaritalStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "HousingType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "HousingType",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "HousingType",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Common",
                table: "HousingType",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "HousingType",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Common",
                table: "HousingType",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Common",
                table: "HousingType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Common",
                table: "HousingType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "HousingType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "HousingType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "EmailQueue",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "EmailQueue",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "EmailQueue",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Common",
                table: "EmailQueue",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "EmailQueue",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Common",
                table: "EmailQueue",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Common",
                table: "EmailQueue",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Common",
                table: "EmailQueue",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "EmailQueue",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "EmailQueue",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "Attachment",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Attachment",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Attachment",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Common",
                table: "Attachment",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Attachment",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Common",
                table: "Attachment",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Common",
                table: "Attachment",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Common",
                table: "Attachment",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "Attachment",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "Attachment",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Common",
                table: "EmailQueue");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Common",
                table: "EmailQueue");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Common",
                table: "EmailQueue");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Common",
                table: "EmailQueue");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Common",
                table: "EmailQueue");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "EmailQueue");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "EmailQueue");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "Status",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Status",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Status",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "Priority",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Priority",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Priority",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "NotificationType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "NotificationType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "NotificationType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "Notification",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Notification",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Notification",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "MaritalStatus",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "MaritalStatus",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "MaritalStatus",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "HousingType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "HousingType",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "HousingType",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "EmailQueue",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "EmailQueue",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "EmailQueue",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Common",
                table: "Attachment",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Attachment",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Attachment",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
