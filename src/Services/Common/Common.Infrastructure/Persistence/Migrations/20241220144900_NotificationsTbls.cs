using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class NotificationsTbls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Config");

            migrationBuilder.RenameIndex(
                name: "UI_MaritalStatus_Code",
                schema: "Common",
                table: "MaritalStatus",
                newName: "UX_MaritalStatus_Code");

            migrationBuilder.RenameIndex(
                name: "UI_HousingType_Code",
                schema: "Common",
                table: "HousingType",
                newName: "UX_HousingType_Code");

            migrationBuilder.CreateTable(
                name: "EmailSenderConfig",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: true),
                    IsGlobal = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    SenderEmail = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    SenderName = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    SmtpServer = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    SmtpPort = table.Column<int>(type: "int", nullable: false),
                    UseSsl = table.Column<bool>(type: "bit", nullable: false),
                    Username = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    EncryptedPassword = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    PasswordHash = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Password = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailSenderConfig", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NotificationType",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Priority",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Priority", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Status",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Status", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WhatsAppSenderConfig",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: true),
                    IsGlobal = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    AccountId = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    AuthToken = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: true),
                    UrlService = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WhatsAppSenderConfig", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Notification",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NotificationTypeId = table.Column<int>(type: "int", nullable: false),
                    CompressedParameters = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Title = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Subject = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    Message = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    IsRead = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notification_NotificationType_NotificationTypeId",
                        column: x => x.NotificationTypeId,
                        principalSchema: "Common",
                        principalTable: "NotificationType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Attachment",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NotificationId = table.Column<int>(type: "int", nullable: false),
                    FileName = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    FileType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    FileSize = table.Column<int>(type: "int", nullable: true),
                    FilePath = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    S3ObjectKey = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    S3ObjectUrl = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attachment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Attachment_Notification_NotificationId",
                        column: x => x.NotificationId,
                        principalSchema: "Common",
                        principalTable: "Notification",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmailQueue",
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
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailQueue", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailQueue_EmailSenderConfig_EmailSenderConfigId",
                        column: x => x.EmailSenderConfigId,
                        principalSchema: "Config",
                        principalTable: "EmailSenderConfig",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmailQueue_Notification_NotificationId",
                        column: x => x.NotificationId,
                        principalSchema: "Common",
                        principalTable: "Notification",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmailQueue_Priority_PriorityId",
                        column: x => x.PriorityId,
                        principalSchema: "Common",
                        principalTable: "Priority",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmailQueue_Status_StatusId",
                        column: x => x.StatusId,
                        principalSchema: "Common",
                        principalTable: "Status",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WhatsAppMessage",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NotificationId = table.Column<int>(type: "int", nullable: false),
                    WhatsAppSenderConfigId = table.Column<int>(type: "int", nullable: false),
                    CompressedMessage = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Os = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: true),
                    Browser = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: true),
                    RecipientPhoneNumber = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: false),
                    PriorityId = table.Column<int>(type: "int", nullable: false),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    ScheduledAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WhatsAppMessage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WhatsAppMessage_Notification_NotificationId",
                        column: x => x.NotificationId,
                        principalSchema: "Common",
                        principalTable: "Notification",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WhatsAppMessage_Priority_PriorityId",
                        column: x => x.PriorityId,
                        principalSchema: "Common",
                        principalTable: "Priority",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WhatsAppMessage_Status_StatusId",
                        column: x => x.StatusId,
                        principalSchema: "Common",
                        principalTable: "Status",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WhatsAppMessage_WhatsAppSenderConfig_WhatsAppSenderConfigId",
                        column: x => x.WhatsAppSenderConfigId,
                        principalSchema: "Config",
                        principalTable: "WhatsAppSenderConfig",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attachment_NotificationId",
                schema: "Common",
                table: "Attachment",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailQueue_EmailSenderConfigId",
                schema: "Common",
                table: "EmailQueue",
                column: "EmailSenderConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailQueue_NotificationId",
                schema: "Common",
                table: "EmailQueue",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailQueue_PriorityId",
                schema: "Common",
                table: "EmailQueue",
                column: "PriorityId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailQueue_StatusId",
                schema: "Common",
                table: "EmailQueue",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_NotificationTypeId",
                schema: "Common",
                table: "Notification",
                column: "NotificationTypeId");

            migrationBuilder.CreateIndex(
                name: "UX_NotificationType_Code",
                schema: "Common",
                table: "NotificationType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UX_Priority_Code",
                schema: "Common",
                table: "Priority",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UX_Status_Code",
                schema: "Common",
                table: "Status",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppMessage_NotificationId",
                schema: "Common",
                table: "WhatsAppMessage",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppMessage_PriorityId",
                schema: "Common",
                table: "WhatsAppMessage",
                column: "PriorityId");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppMessage_StatusId",
                schema: "Common",
                table: "WhatsAppMessage",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppMessage_WhatsAppSenderConfigId",
                schema: "Common",
                table: "WhatsAppMessage",
                column: "WhatsAppSenderConfigId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attachment",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "EmailQueue",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "WhatsAppMessage",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "EmailSenderConfig",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "Notification",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "Priority",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "Status",
                schema: "Common");

            migrationBuilder.DropTable(
                name: "WhatsAppSenderConfig",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "NotificationType",
                schema: "Common");

            migrationBuilder.RenameIndex(
                name: "UX_MaritalStatus_Code",
                schema: "Common",
                table: "MaritalStatus",
                newName: "UI_MaritalStatus_Code");

            migrationBuilder.RenameIndex(
                name: "UX_HousingType_Code",
                schema: "Common",
                table: "HousingType",
                newName: "UI_HousingType_Code");
        }
    }
}
