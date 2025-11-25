using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Api.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class IdentityEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.EnsureSchema(
                name: "Auth");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginHistory",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginFailed",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Seguridad",
                table: "ForgotPassword",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Seguridad",
                table: "AccessAuthorization",
                newName: "IsMobileRequest");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "Token",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()",
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Expiration",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "DATEADD(HOUR, 1, GETUTCDATE())",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Roles",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DisplayName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    UserName = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: false),
                    NormalizedUserName = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    SecurityStamp = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    PhoneNumber = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    ClaimType = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ClaimValue = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Auth",
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Token = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: false),
                    Expires = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedByIp = table.Column<string>(type: "varchar(39)", unicode: false, maxLength: 39, nullable: true),
                    Revoked = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RevokedByIp = table.Column<string>(type: "varchar(39)", unicode: false, maxLength: 39, nullable: true),
                    ReplacedByToken = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: true),
                    DeviceInfo = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    UserAgent = table.Column<string>(type: "varchar(2000)", unicode: false, maxLength: 2000, nullable: true),
                    AppUserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Users_AppUserId",
                        column: x => x.AppUserId,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ClaimType = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ClaimValue = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserClaims_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                schema: "Auth",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "varchar(900)", unicode: false, nullable: false),
                    ProviderKey = table.Column<string>(type: "varchar(900)", unicode: false, nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_UserLogins_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserProfile",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppUserId = table.Column<int>(type: "int", nullable: false),
                    PreferredLanguage = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true, defaultValue: "es-ES"),
                    TimeZone = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true, defaultValue: "America/Guayaquil"),
                    Theme = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true, defaultValue: "light"),
                    EmailNotifications = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    SmsNotifications = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    WhatsAppNotifications = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    FirstName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    LastName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Gender = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    DefaultCurrency = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "USD"),
                    DateFormat = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "dd/MM/yyyy"),
                    TimeFormat = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "HH:mm"),
                    NumberFormat = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "en-US"),
                    DefaultPageSize = table.Column<int>(type: "int", nullable: true, defaultValue: 25),
                    ShowAdvancedFeatures = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    LastLoginDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastPasswordChange = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RequirePasswordChange = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    SessionTimeoutMinutes = table.Column<int>(type: "int", nullable: true, defaultValue: 60),
                    ReceivePromotionalEmails = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    ReceiveSystemUpdates = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    ReceiveNewsletters = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    PreferredContactMethod = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true, defaultValue: "Email"),
                    PreferredContactTime = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    CustomProperties = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_UserProfile", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfile_Users_AppUserId",
                        column: x => x.AppUserId,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                schema: "Auth",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Auth",
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                schema: "Auth",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    LoginProvider = table.Column<string>(type: "varchar(900)", unicode: false, nullable: false),
                    Name = table.Column<string>(type: "varchar(900)", unicode: false, nullable: false),
                    Value = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_UserTokens_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_CreatedAt",
                schema: "Seguridad",
                table: "LoginHistory",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_CreatedByUserId",
                schema: "Seguridad",
                table: "LoginHistory",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_Ip_Created",
                schema: "Seguridad",
                table: "LoginHistory",
                columns: new[] { "IpAddress", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_IpAddress",
                schema: "Seguridad",
                table: "LoginHistory",
                column: "IpAddress");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_IsActive",
                schema: "Seguridad",
                table: "LoginHistory",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_IsDeleted",
                schema: "Seguridad",
                table: "LoginHistory",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_IsLoggedIn",
                schema: "Seguridad",
                table: "LoginHistory",
                column: "IsLoggedIn");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_LoggedIn_Created",
                schema: "Seguridad",
                table: "LoginHistory",
                columns: new[] { "IsLoggedIn", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_Status",
                schema: "Seguridad",
                table: "LoginHistory",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_TokenExpiration",
                schema: "Seguridad",
                table: "LoginHistory",
                column: "TokenExpiration");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_UserRole_Created",
                schema: "Seguridad",
                table: "LoginHistory",
                columns: new[] { "UserRoleId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistory_UserRoleId",
                schema: "Seguridad",
                table: "LoginHistory",
                column: "UserRoleId");

            migrationBuilder.CreateIndex(
                name: "IX_LoginFailed_CreatedAt",
                schema: "Seguridad",
                table: "LoginFailed",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_LoginFailed_CreatedByUserId",
                schema: "Seguridad",
                table: "LoginFailed",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LoginFailed_Ip_Created",
                schema: "Seguridad",
                table: "LoginFailed",
                columns: new[] { "IpAddress", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_LoginFailed_IpAddress",
                schema: "Seguridad",
                table: "LoginFailed",
                column: "IpAddress");

            migrationBuilder.CreateIndex(
                name: "IX_LoginFailed_IsActive",
                schema: "Seguridad",
                table: "LoginFailed",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LoginFailed_IsDeleted",
                schema: "Seguridad",
                table: "LoginFailed",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LoginFailed_Status",
                schema: "Seguridad",
                table: "LoginFailed",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_LoginFailed_Username",
                schema: "Seguridad",
                table: "LoginFailed",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_LoginFailed_Username_Created",
                schema: "Seguridad",
                table: "LoginFailed",
                columns: new[] { "Username", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_ForgotPassword_Active_Expiration",
                schema: "Seguridad",
                table: "ForgotPassword",
                columns: new[] { "IsActive", "Expiration" });

            migrationBuilder.CreateIndex(
                name: "IX_ForgotPassword_CreatedAt",
                schema: "Seguridad",
                table: "ForgotPassword",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ForgotPassword_CreatedByUserId",
                schema: "Seguridad",
                table: "ForgotPassword",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ForgotPassword_Email",
                schema: "Seguridad",
                table: "ForgotPassword",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_ForgotPassword_Email_Token_Expiration",
                schema: "Seguridad",
                table: "ForgotPassword",
                columns: new[] { "Email", "Token", "Expiration" });

            migrationBuilder.CreateIndex(
                name: "IX_ForgotPassword_Expiration",
                schema: "Seguridad",
                table: "ForgotPassword",
                column: "Expiration");

            migrationBuilder.CreateIndex(
                name: "IX_ForgotPassword_IsActive",
                schema: "Seguridad",
                table: "ForgotPassword",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ForgotPassword_IsDeleted",
                schema: "Seguridad",
                table: "ForgotPassword",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ForgotPassword_Status",
                schema: "Seguridad",
                table: "ForgotPassword",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_ForgotPassword_Token",
                schema: "Seguridad",
                table: "ForgotPassword",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AccessAuthorization_CreatedAt",
                schema: "Seguridad",
                table: "AccessAuthorization",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_AccessAuthorization_CreatedByUserId",
                schema: "Seguridad",
                table: "AccessAuthorization",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessAuthorization_IsActive",
                schema: "Seguridad",
                table: "AccessAuthorization",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_AccessAuthorization_IsDeleted",
                schema: "Seguridad",
                table: "AccessAuthorization",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AccessAuthorization_ReceiverId",
                schema: "Seguridad",
                table: "AccessAuthorization",
                column: "ReceiverId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessAuthorization_Sender_Active_Created",
                schema: "Seguridad",
                table: "AccessAuthorization",
                columns: new[] { "SenderId", "IsActive", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_AccessAuthorization_SenderId",
                schema: "Seguridad",
                table: "AccessAuthorization",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_AccessAuthorization_Status",
                schema: "Seguridad",
                table: "AccessAuthorization",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_AccessAuthorization_Uuid",
                schema: "Seguridad",
                table: "AccessAuthorization",
                column: "Uuid");

            migrationBuilder.CreateIndex(
                name: "IX_AccessAuthorization_Uuid_Code",
                schema: "Seguridad",
                table: "AccessAuthorization",
                columns: new[] { "Uuid", "Code" });

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_AppUserId",
                schema: "Auth",
                table: "RefreshTokens",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_Expires",
                schema: "Auth",
                table: "RefreshTokens",
                column: "Expires");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_Token",
                schema: "Auth",
                table: "RefreshTokens",
                column: "Token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserId_Expires",
                schema: "Auth",
                table: "RefreshTokens",
                columns: new[] { "AppUserId", "Expires" });

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_RoleId",
                schema: "Auth",
                table: "RoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                schema: "Auth",
                table: "Roles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_UserClaims_UserId",
                schema: "Auth",
                table: "UserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogins_UserId",
                schema: "Auth",
                table: "UserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfile_AppUserId",
                schema: "Auth",
                table: "UserProfile",
                column: "AppUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserProfile_CreatedAt",
                schema: "Auth",
                table: "UserProfile",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfile_CreatedByUserId",
                schema: "Auth",
                table: "UserProfile",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfile_IsActive",
                schema: "Auth",
                table: "UserProfile",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfile_IsDeleted",
                schema: "Auth",
                table: "UserProfile",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfile_Status",
                schema: "Auth",
                table: "UserProfile",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                schema: "Auth",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_UserId",
                schema: "Auth",
                table: "UserRoles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                schema: "Auth",
                table: "Users",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "IX_AppUser_Email",
                schema: "Auth",
                table: "Users",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_AppUser_UserName",
                schema: "Auth",
                table: "Users",
                column: "UserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                schema: "Auth",
                table: "Users",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RefreshTokens",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "RoleClaims",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "UserClaims",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "UserLogins",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "UserProfile",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "UserRoles",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "UserTokens",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "Roles",
                schema: "Auth");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "Auth");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_CreatedAt",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_CreatedByUserId",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_Ip_Created",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_IpAddress",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_IsActive",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_IsDeleted",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_IsLoggedIn",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_LoggedIn_Created",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_Status",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_TokenExpiration",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_UserRole_Created",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistory_UserRoleId",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropIndex(
                name: "IX_LoginFailed_CreatedAt",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropIndex(
                name: "IX_LoginFailed_CreatedByUserId",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropIndex(
                name: "IX_LoginFailed_Ip_Created",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropIndex(
                name: "IX_LoginFailed_IpAddress",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropIndex(
                name: "IX_LoginFailed_IsActive",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropIndex(
                name: "IX_LoginFailed_IsDeleted",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropIndex(
                name: "IX_LoginFailed_Status",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropIndex(
                name: "IX_LoginFailed_Username",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropIndex(
                name: "IX_LoginFailed_Username_Created",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropIndex(
                name: "IX_ForgotPassword_Active_Expiration",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropIndex(
                name: "IX_ForgotPassword_CreatedAt",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropIndex(
                name: "IX_ForgotPassword_CreatedByUserId",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropIndex(
                name: "IX_ForgotPassword_Email",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropIndex(
                name: "IX_ForgotPassword_Email_Token_Expiration",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropIndex(
                name: "IX_ForgotPassword_Expiration",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropIndex(
                name: "IX_ForgotPassword_IsActive",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropIndex(
                name: "IX_ForgotPassword_IsDeleted",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropIndex(
                name: "IX_ForgotPassword_Status",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropIndex(
                name: "IX_ForgotPassword_Token",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropIndex(
                name: "IX_AccessAuthorization_CreatedAt",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropIndex(
                name: "IX_AccessAuthorization_CreatedByUserId",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropIndex(
                name: "IX_AccessAuthorization_IsActive",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropIndex(
                name: "IX_AccessAuthorization_IsDeleted",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropIndex(
                name: "IX_AccessAuthorization_ReceiverId",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropIndex(
                name: "IX_AccessAuthorization_Sender_Active_Created",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropIndex(
                name: "IX_AccessAuthorization_SenderId",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropIndex(
                name: "IX_AccessAuthorization_Status",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropIndex(
                name: "IX_AccessAuthorization_Uuid",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropIndex(
                name: "IX_AccessAuthorization_Uuid_Code",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Seguridad",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Seguridad",
                table: "LoginHistory");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Seguridad",
                table: "LoginFailed");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Seguridad",
                table: "ForgotPassword");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Seguridad",
                table: "LoginHistory",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Seguridad",
                table: "LoginFailed",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Seguridad",
                table: "ForgotPassword",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Seguridad",
                table: "AccessAuthorization",
                newName: "FromMobile");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Seguridad",
                table: "LoginHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Seguridad",
                table: "LoginFailed",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "Token",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldDefaultValueSql: "NEWID()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Expiration",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "DATEADD(HOUR, 1, GETUTCDATE())");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Seguridad",
                table: "ForgotPassword",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "int",
                nullable: true);
        }
    }
}
