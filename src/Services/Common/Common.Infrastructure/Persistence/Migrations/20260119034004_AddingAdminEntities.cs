using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddingAdminEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Common",
                table: "WhatsAppMessage",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Common",
                table: "Status",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Common",
                table: "Priority",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Common",
                table: "NotificationType",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Common",
                table: "Notification",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Common",
                table: "MaritalStatus",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Common",
                table: "HousingType",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Config",
                table: "EmailSenderConfig",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Common",
                table: "Attachment",
                newName: "IsMobileRequest");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "Status",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Status",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "Status",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Common",
                table: "Status",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Common",
                table: "Status",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Common",
                table: "Status",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "Priority",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Priority",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "Priority",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Common",
                table: "Priority",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Common",
                table: "Priority",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Common",
                table: "Priority",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "NotificationType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "NotificationType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "NotificationType",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Common",
                table: "NotificationType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Common",
                table: "NotificationType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Common",
                table: "NotificationType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "Notification",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Notification",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "Notification",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Common",
                table: "Notification",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Common",
                table: "Notification",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Common",
                table: "Notification",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "MaritalStatus",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "MaritalStatus",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "MaritalStatus",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Common",
                table: "MaritalStatus",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Common",
                table: "MaritalStatus",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Common",
                table: "MaritalStatus",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "HousingType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "HousingType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "HousingType",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Common",
                table: "HousingType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Common",
                table: "HousingType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Common",
                table: "HousingType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "Attachment",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Attachment",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "Attachment",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Common",
                table: "Attachment",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Common",
                table: "Attachment",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Common",
                table: "Attachment",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Email",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NotificationId = table.Column<int>(type: "int", nullable: false),
                    EmailSenderConfigId = table.Column<int>(type: "int", nullable: false),
                    RecipientEmail = table.Column<string>(type: "varchar(254)", unicode: false, maxLength: 254, nullable: false),
                    Subject = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    Cc = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: true),
                    IsHtml = table.Column<bool>(type: "bit", nullable: false),
                    CompressedBody = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    PriorityId = table.Column<int>(type: "int", nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    RetryCount = table.Column<int>(type: "int", nullable: true),
                    ScheduledAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Template = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    UpdatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    DeletedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Email", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Email_EmailSenderConfig_EmailSenderConfigId",
                        column: x => x.EmailSenderConfigId,
                        principalSchema: "Config",
                        principalTable: "EmailSenderConfig",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Email_Notification_NotificationId",
                        column: x => x.NotificationId,
                        principalSchema: "Common",
                        principalTable: "Notification",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Email_Priority_PriorityId",
                        column: x => x.PriorityId,
                        principalSchema: "Common",
                        principalTable: "Priority",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Email_Status_StatusId",
                        column: x => x.StatusId,
                        principalSchema: "Common",
                        principalTable: "Status",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Release",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AplicacionId = table.Column<int>(type: "int", nullable: false),
                    ReleaseDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Version = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    Title = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: false),
                    LogoutRequired = table.Column<bool>(type: "bit", nullable: false),
                    CompressedContent = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Release", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tag",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tag", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserManualType",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserManualType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserReleaseRead",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReleaseId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    UpdatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    DeletedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserReleaseRead", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserReleaseRead_Release_ReleaseId",
                        column: x => x.ReleaseId,
                        principalSchema: "Common",
                        principalTable: "Release",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserManual",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserManualTypeId = table.Column<int>(type: "int", nullable: false),
                    MenuId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: false),
                    CompressedContent = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserManual", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserManual_UserManualType_UserManualTypeId",
                        column: x => x.UserManualTypeId,
                        principalSchema: "Common",
                        principalTable: "UserManualType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserManualTag",
                schema: "Common",
                columns: table => new
                {
                    UserManualId = table.Column<int>(type: "int", nullable: false),
                    TagId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserManualTag", x => new { x.UserManualId, x.TagId });
                    table.ForeignKey(
                        name: "FK_UserManualTag_Tag_TagId",
                        column: x => x.TagId,
                        principalSchema: "Common",
                        principalTable: "Tag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserManualTag_UserManual_UserManualId",
                        column: x => x.UserManualId,
                        principalSchema: "Common",
                        principalTable: "UserManual",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppSenderConfig_CreatedAt",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppSenderConfig_CreatedByUserId",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppSenderConfig_IsActive",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppSenderConfig_IsDeleted",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppSenderConfig_Status",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppMessage_CreatedAt",
                schema: "Common",
                table: "WhatsAppMessage",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppMessage_CreatedByUserId",
                schema: "Common",
                table: "WhatsAppMessage",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppMessage_IsActive",
                schema: "Common",
                table: "WhatsAppMessage",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppMessage_IsDeleted",
                schema: "Common",
                table: "WhatsAppMessage",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppMessage_Status",
                schema: "Common",
                table: "WhatsAppMessage",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Status_CreatedAt",
                schema: "Common",
                table: "Status",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Status_CreatedByUserId",
                schema: "Common",
                table: "Status",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Status_IsActive",
                schema: "Common",
                table: "Status",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Status_IsDeleted",
                schema: "Common",
                table: "Status",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Status_Status",
                schema: "Common",
                table: "Status",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Priority_CreatedAt",
                schema: "Common",
                table: "Priority",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Priority_CreatedByUserId",
                schema: "Common",
                table: "Priority",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Priority_IsActive",
                schema: "Common",
                table: "Priority",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Priority_IsDeleted",
                schema: "Common",
                table: "Priority",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Priority_Status",
                schema: "Common",
                table: "Priority",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_NotificationType_CreatedAt",
                schema: "Common",
                table: "NotificationType",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationType_CreatedByUserId",
                schema: "Common",
                table: "NotificationType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationType_IsActive",
                schema: "Common",
                table: "NotificationType",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationType_IsDeleted",
                schema: "Common",
                table: "NotificationType",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationType_Status",
                schema: "Common",
                table: "NotificationType",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Notification_CreatedAt",
                schema: "Common",
                table: "Notification",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_CreatedByUserId",
                schema: "Common",
                table: "Notification",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_IsActive",
                schema: "Common",
                table: "Notification",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_IsDeleted",
                schema: "Common",
                table: "Notification",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_Status",
                schema: "Common",
                table: "Notification",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_MaritalStatus_CreatedAt",
                schema: "Common",
                table: "MaritalStatus",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MaritalStatus_CreatedByUserId",
                schema: "Common",
                table: "MaritalStatus",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MaritalStatus_IsActive",
                schema: "Common",
                table: "MaritalStatus",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_MaritalStatus_IsDeleted",
                schema: "Common",
                table: "MaritalStatus",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MaritalStatus_Status",
                schema: "Common",
                table: "MaritalStatus",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_HousingType_CreatedAt",
                schema: "Common",
                table: "HousingType",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_HousingType_CreatedByUserId",
                schema: "Common",
                table: "HousingType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_HousingType_IsActive",
                schema: "Common",
                table: "HousingType",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_HousingType_IsDeleted",
                schema: "Common",
                table: "HousingType",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_HousingType_Status",
                schema: "Common",
                table: "HousingType",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_EmailSenderConfig_CreatedAt",
                schema: "Config",
                table: "EmailSenderConfig",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_EmailSenderConfig_CreatedByUserId",
                schema: "Config",
                table: "EmailSenderConfig",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailSenderConfig_IsActive",
                schema: "Config",
                table: "EmailSenderConfig",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_EmailSenderConfig_IsDeleted",
                schema: "Config",
                table: "EmailSenderConfig",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_EmailSenderConfig_Status",
                schema: "Config",
                table: "EmailSenderConfig",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Attachment_CreatedAt",
                schema: "Common",
                table: "Attachment",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Attachment_CreatedByUserId",
                schema: "Common",
                table: "Attachment",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Attachment_IsActive",
                schema: "Common",
                table: "Attachment",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Attachment_IsDeleted",
                schema: "Common",
                table: "Attachment",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Attachment_Status",
                schema: "Common",
                table: "Attachment",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Email_CreatedAt",
                schema: "Common",
                table: "Email",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Email_CreatedByUserId",
                schema: "Common",
                table: "Email",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Email_EmailSenderConfigId",
                schema: "Common",
                table: "Email",
                column: "EmailSenderConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_Email_IsActive",
                schema: "Common",
                table: "Email",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Email_IsDeleted",
                schema: "Common",
                table: "Email",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Email_NotificationId",
                schema: "Common",
                table: "Email",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_Email_PriorityId",
                schema: "Common",
                table: "Email",
                column: "PriorityId");

            migrationBuilder.CreateIndex(
                name: "IX_Email_Status",
                schema: "Common",
                table: "Email",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Email_StatusId",
                schema: "Common",
                table: "Email",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Release_CreatedAt",
                schema: "Common",
                table: "Release",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Release_CreatedByUserId",
                schema: "Common",
                table: "Release",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Release_IsActive",
                schema: "Common",
                table: "Release",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Release_IsDeleted",
                schema: "Common",
                table: "Release",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Release_Status",
                schema: "Common",
                table: "Release",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Tag_CreatedAt",
                schema: "Common",
                table: "Tag",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Tag_CreatedByUserId",
                schema: "Common",
                table: "Tag",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Tag_IsActive",
                schema: "Common",
                table: "Tag",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Tag_IsDeleted",
                schema: "Common",
                table: "Tag",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Tag_Status",
                schema: "Common",
                table: "Tag",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_UserManual_CreatedAt",
                schema: "Common",
                table: "UserManual",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_UserManual_CreatedByUserId",
                schema: "Common",
                table: "UserManual",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserManual_IsActive",
                schema: "Common",
                table: "UserManual",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_UserManual_IsDeleted",
                schema: "Common",
                table: "UserManual",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_UserManual_Status",
                schema: "Common",
                table: "UserManual",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_UserManual_UserManualTypeId",
                schema: "Common",
                table: "UserManual",
                column: "UserManualTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_UserManualTag_CreatedAt",
                schema: "Common",
                table: "UserManualTag",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_UserManualTag_CreatedByUserId",
                schema: "Common",
                table: "UserManualTag",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserManualTag_IsActive",
                schema: "Common",
                table: "UserManualTag",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_UserManualTag_IsDeleted",
                schema: "Common",
                table: "UserManualTag",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_UserManualTag_Status",
                schema: "Common",
                table: "UserManualTag",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_UserManualTag_TagId",
                schema: "Common",
                table: "UserManualTag",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_UserManualType_CreatedAt",
                schema: "Common",
                table: "UserManualType",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_UserManualType_CreatedByUserId",
                schema: "Common",
                table: "UserManualType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserManualType_IsActive",
                schema: "Common",
                table: "UserManualType",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_UserManualType_IsDeleted",
                schema: "Common",
                table: "UserManualType",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_UserManualType_Status",
                schema: "Common",
                table: "UserManualType",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_UserManual_Code",
                schema: "Common",
                table: "UserManualType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserReleaseRead_CreatedAt",
                schema: "Common",
                table: "UserReleaseRead",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_UserReleaseRead_CreatedByUserId",
                schema: "Common",
                table: "UserReleaseRead",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserReleaseRead_IsActive",
                schema: "Common",
                table: "UserReleaseRead",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_UserReleaseRead_IsDeleted",
                schema: "Common",
                table: "UserReleaseRead",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_UserReleaseRead_ReleaseId",
                schema: "Common",
                table: "UserReleaseRead",
                column: "ReleaseId");

            migrationBuilder.CreateIndex(
                name: "IX_UserReleaseRead_Status",
                schema: "Common",
                table: "UserReleaseRead",
                columns: new[] { "IsActive", "IsDeleted" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Email",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "UserManualTag",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "UserReleaseRead",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "Tag",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "UserManual",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "Release",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "UserManualType",
                schema: "Common");

            migrationBuilder.DropIndex(
                name: "IX_WhatsAppSenderConfig_CreatedAt",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropIndex(
                name: "IX_WhatsAppSenderConfig_CreatedByUserId",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropIndex(
                name: "IX_WhatsAppSenderConfig_IsActive",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropIndex(
                name: "IX_WhatsAppSenderConfig_IsDeleted",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropIndex(
                name: "IX_WhatsAppSenderConfig_Status",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropIndex(
                name: "IX_WhatsAppMessage_CreatedAt",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropIndex(
                name: "IX_WhatsAppMessage_CreatedByUserId",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropIndex(
                name: "IX_WhatsAppMessage_IsActive",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropIndex(
                name: "IX_WhatsAppMessage_IsDeleted",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropIndex(
                name: "IX_WhatsAppMessage_Status",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropIndex(
                name: "IX_Status_CreatedAt",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropIndex(
                name: "IX_Status_CreatedByUserId",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropIndex(
                name: "IX_Status_IsActive",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropIndex(
                name: "IX_Status_IsDeleted",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropIndex(
                name: "IX_Status_Status",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropIndex(
                name: "IX_Priority_CreatedAt",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropIndex(
                name: "IX_Priority_CreatedByUserId",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropIndex(
                name: "IX_Priority_IsActive",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropIndex(
                name: "IX_Priority_IsDeleted",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropIndex(
                name: "IX_Priority_Status",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropIndex(
                name: "IX_NotificationType_CreatedAt",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropIndex(
                name: "IX_NotificationType_CreatedByUserId",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropIndex(
                name: "IX_NotificationType_IsActive",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropIndex(
                name: "IX_NotificationType_IsDeleted",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropIndex(
                name: "IX_NotificationType_Status",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropIndex(
                name: "IX_Notification_CreatedAt",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_Notification_CreatedByUserId",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_Notification_IsActive",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_Notification_IsDeleted",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_Notification_Status",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_MaritalStatus_CreatedAt",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropIndex(
                name: "IX_MaritalStatus_CreatedByUserId",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropIndex(
                name: "IX_MaritalStatus_IsActive",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropIndex(
                name: "IX_MaritalStatus_IsDeleted",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropIndex(
                name: "IX_MaritalStatus_Status",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropIndex(
                name: "IX_HousingType_CreatedAt",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropIndex(
                name: "IX_HousingType_CreatedByUserId",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropIndex(
                name: "IX_HousingType_IsActive",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropIndex(
                name: "IX_HousingType_IsDeleted",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropIndex(
                name: "IX_HousingType_Status",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropIndex(
                name: "IX_EmailSenderConfig_CreatedAt",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropIndex(
                name: "IX_EmailSenderConfig_CreatedByUserId",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropIndex(
                name: "IX_EmailSenderConfig_IsActive",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropIndex(
                name: "IX_EmailSenderConfig_IsDeleted",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropIndex(
                name: "IX_EmailSenderConfig_Status",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropIndex(
                name: "IX_Attachment_CreatedAt",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropIndex(
                name: "IX_Attachment_CreatedByUserId",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropIndex(
                name: "IX_Attachment_IsActive",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropIndex(
                name: "IX_Attachment_IsDeleted",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropIndex(
                name: "IX_Attachment_Status",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Common",
                table: "Attachment");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Common",
                table: "WhatsAppMessage",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Common",
                table: "Status",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Common",
                table: "Priority",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Common",
                table: "NotificationType",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Common",
                table: "Notification",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Common",
                table: "MaritalStatus",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Common",
                table: "HousingType",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Config",
                table: "EmailSenderConfig",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Common",
                table: "Attachment",
                newName: "FromMobile");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "Status",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Status",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "Status",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Status",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Status",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Common",
                table: "Status",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "Priority",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Priority",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "Priority",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Priority",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Priority",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Common",
                table: "Priority",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "NotificationType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "NotificationType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "NotificationType",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "NotificationType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "NotificationType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Common",
                table: "NotificationType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "Notification",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Notification",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "Notification",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Notification",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Notification",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Common",
                table: "Notification",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "MaritalStatus",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "MaritalStatus",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "MaritalStatus",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "MaritalStatus",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "MaritalStatus",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Common",
                table: "MaritalStatus",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "HousingType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "HousingType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "HousingType",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "HousingType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "HousingType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Common",
                table: "HousingType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Common",
                table: "Attachment",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Common",
                table: "Attachment",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Common",
                table: "Attachment",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Common",
                table: "Attachment",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Common",
                table: "Attachment",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Common",
                table: "Attachment",
                type: "int",
                nullable: true);
        }
    }
}
