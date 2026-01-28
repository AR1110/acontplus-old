using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddingAdminEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RefreshTokens_Users_AppUserId",
                schema: "Auth",
                table: "RefreshTokens");

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
                name: "Users",
                schema: "Auth");

            migrationBuilder.DropIndex(
                name: "RoleNameIndex",
                schema: "Auth",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                schema: "Auth",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "NormalizedName",
                schema: "Auth",
                table: "Roles");

            migrationBuilder.EnsureSchema(
                name: "Access");

            migrationBuilder.EnsureSchema(
                name: "Compliance");

            migrationBuilder.RenameTable(
                name: "Roles",
                schema: "Auth",
                newName: "Roles",
                newSchema: "Access");

            migrationBuilder.RenameTable(
                name: "LoginHistoryArchive",
                schema: "Seguridad",
                newName: "LoginHistoryArchive",
                newSchema: "Auth");

            migrationBuilder.RenameTable(
                name: "LoginHistory",
                schema: "Seguridad",
                newName: "LoginHistory",
                newSchema: "Auth");

            migrationBuilder.RenameTable(
                name: "LoginFailed",
                schema: "Seguridad",
                newName: "LoginFailed",
                newSchema: "Auth");

            migrationBuilder.RenameTable(
                name: "ForgotPassword",
                schema: "Seguridad",
                newName: "ForgotPassword",
                newSchema: "Auth");

            migrationBuilder.RenameTable(
                name: "AccessAuthorization",
                schema: "Seguridad",
                newName: "AccessAuthorization",
                newSchema: "Access");

            migrationBuilder.RenameColumn(
                name: "AppUserId",
                schema: "Auth",
                table: "RefreshTokens",
                newName: "UserId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "Access",
                table: "Roles",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(256)",
                oldUnicode: false,
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AuthorizationRequired",
                schema: "Access",
                table: "Roles",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                schema: "Access",
                table: "Roles",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "Access",
                table: "Roles",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Access",
                table: "Roles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Access",
                table: "Roles",
                type: "datetime2(7)",
                precision: 7,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Access",
                table: "Roles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                schema: "Access",
                table: "Roles",
                type: "varchar(500)",
                unicode: false,
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Access",
                table: "Roles",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Access",
                table: "Roles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsMobileRequest",
                schema: "Access",
                table: "Roles",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Access",
                table: "Roles",
                type: "datetime2(7)",
                precision: 7,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Access",
                table: "Roles",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Auth",
                table: "LoginHistoryArchive",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Auth",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                schema: "Auth",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "Auth",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Auth",
                table: "LoginHistoryArchive",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Auth",
                table: "LoginHistoryArchive",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateTable(
                name: "Actions",
                schema: "Access",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
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
                    table.PrimaryKey("PK_Actions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FeaturePolicyAccess",
                schema: "Access",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FeaturePolicyConfigurationId = table.Column<int>(type: "int", nullable: false),
                    HasAccess = table.Column<bool>(type: "bit", nullable: false),
                    AccessGrantedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AccessExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AccessReason = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    UserConsumptionLimit = table.Column<int>(type: "int", nullable: true),
                    UserCurrentConsumption = table.Column<int>(type: "int", nullable: true),
                    UserConsumptionResetDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AllowedStartTime = table.Column<TimeSpan>(type: "time", nullable: true),
                    AllowedEndTime = table.Column<TimeSpan>(type: "time", nullable: true),
                    AllowedDays = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Notes = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
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
                    table.PrimaryKey("PK_FeaturePolicyAccess", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LicenseAccesses",
                schema: "Access",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LicenseId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_LicenseAccesses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PolicyConfigurationAudit",
                schema: "Compliance",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PolicyTypeId = table.Column<int>(type: "int", nullable: false),
                    LicenseTypeId = table.Column<int>(type: "int", nullable: true),
                    CompanyId = table.Column<int>(type: "int", nullable: true),
                    ChangeType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    OldValue = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    NewValue = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    ChangeReason = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
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
                    table.PrimaryKey("PK_PolicyConfigurationAudit", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PolicyEnforcementLog",
                schema: "Compliance",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    PolicyTypeId = table.Column<int>(type: "int", nullable: false),
                    RequestedValue = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    AllowedValue = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    ActionTaken = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    ResourceType = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    ResourceId = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    AdditionalContext = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
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
                    table.PrimaryKey("PK_PolicyEnforcementLog", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PolicyType",
                schema: "Compliance",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    DataType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    DefaultValue = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
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
                    table.PrimaryKey("PK_PolicyType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PricingPlanAccess",
                schema: "Access",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PricingPlanId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    ActivatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeactivatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
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
                    table.PrimaryKey("PK_PricingPlanAccess", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LicenseAccessDetails",
                schema: "Access",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LicenseAccessId = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: true),
                    MenuId = table.Column<int>(type: "int", nullable: true),
                    Actions = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicenseAccessDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LicenseAccessDetails_LicenseAccesses_LicenseAccessId",
                        column: x => x.LicenseAccessId,
                        principalSchema: "Access",
                        principalTable: "LicenseAccesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PricingPlanAccessDetail",
                schema: "Access",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PricingPlanAccessId = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: true),
                    MenuId = table.Column<int>(type: "int", nullable: true),
                    Actions = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: true),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingPlanAccessDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PricingPlanAccessDetail_PricingPlanAccess_PricingPlanAccessId",
                        column: x => x.PricingPlanAccessId,
                        principalSchema: "Access",
                        principalTable: "PricingPlanAccess",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Role_CreatedAt",
                schema: "Access",
                table: "Roles",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Role_CreatedByUserId",
                schema: "Access",
                table: "Roles",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Role_IsActive",
                schema: "Access",
                table: "Roles",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Role_IsDeleted",
                schema: "Access",
                table: "Roles",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Role_Status",
                schema: "Access",
                table: "Roles",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_Role_Code",
                schema: "Access",
                table: "Roles",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistoryArchive_CreatedAt",
                schema: "Auth",
                table: "LoginHistoryArchive",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistoryArchive_CreatedByUserId",
                schema: "Auth",
                table: "LoginHistoryArchive",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistoryArchive_IsActive",
                schema: "Auth",
                table: "LoginHistoryArchive",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistoryArchive_IsDeleted",
                schema: "Auth",
                table: "LoginHistoryArchive",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistoryArchive_Status",
                schema: "Auth",
                table: "LoginHistoryArchive",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_LoginHistoryArchive_UserRoleId",
                schema: "Auth",
                table: "LoginHistoryArchive",
                column: "UserRoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Actions_CreatedAt",
                schema: "Access",
                table: "Actions",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Actions_CreatedByUserId",
                schema: "Access",
                table: "Actions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Actions_IsActive",
                schema: "Access",
                table: "Actions",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Actions_IsDeleted",
                schema: "Access",
                table: "Actions",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Actions_Status",
                schema: "Access",
                table: "Actions",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_Actions_Code",
                schema: "Access",
                table: "Actions",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyAccess_CreatedAt",
                schema: "Access",
                table: "FeaturePolicyAccess",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyAccess_CreatedByUserId",
                schema: "Access",
                table: "FeaturePolicyAccess",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyAccess_FeaturePolicyConfigurationId",
                schema: "Access",
                table: "FeaturePolicyAccess",
                column: "FeaturePolicyConfigurationId");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyAccess_IsActive",
                schema: "Access",
                table: "FeaturePolicyAccess",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyAccess_IsDeleted",
                schema: "Access",
                table: "FeaturePolicyAccess",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyAccess_Status",
                schema: "Access",
                table: "FeaturePolicyAccess",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_LicenseAccessDetails_CreatedAt",
                schema: "Access",
                table: "LicenseAccessDetails",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseAccessDetails_CreatedByUserId",
                schema: "Access",
                table: "LicenseAccessDetails",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseAccessDetails_IsActive",
                schema: "Access",
                table: "LicenseAccessDetails",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseAccessDetails_IsDeleted",
                schema: "Access",
                table: "LicenseAccessDetails",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseAccessDetails_LicenseAccessId",
                schema: "Access",
                table: "LicenseAccessDetails",
                column: "LicenseAccessId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseAccessDetails_Status",
                schema: "Access",
                table: "LicenseAccessDetails",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_LicenseAccesses_CreatedAt",
                schema: "Access",
                table: "LicenseAccesses",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseAccesses_CreatedByUserId",
                schema: "Access",
                table: "LicenseAccesses",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseAccesses_IsActive",
                schema: "Access",
                table: "LicenseAccesses",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseAccesses_IsDeleted",
                schema: "Access",
                table: "LicenseAccesses",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseAccesses_Status",
                schema: "Access",
                table: "LicenseAccesses",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_PolicyConfigurationAudit_CompanyId",
                schema: "Compliance",
                table: "PolicyConfigurationAudit",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyConfigurationAudit_CreatedAt",
                schema: "Compliance",
                table: "PolicyConfigurationAudit",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyConfigurationAudit_CreatedByUserId",
                schema: "Compliance",
                table: "PolicyConfigurationAudit",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyConfigurationAudit_IsActive",
                schema: "Compliance",
                table: "PolicyConfigurationAudit",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyConfigurationAudit_IsDeleted",
                schema: "Compliance",
                table: "PolicyConfigurationAudit",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyConfigurationAudit_PolicyTypeId",
                schema: "Compliance",
                table: "PolicyConfigurationAudit",
                column: "PolicyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyConfigurationAudit_Status",
                schema: "Compliance",
                table: "PolicyConfigurationAudit",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_PolicyEnforcementLog_Company_PolicyType",
                schema: "Compliance",
                table: "PolicyEnforcementLog",
                columns: new[] { "CompanyId", "PolicyTypeId" });

            migrationBuilder.CreateIndex(
                name: "IX_PolicyEnforcementLog_CompanyId",
                schema: "Compliance",
                table: "PolicyEnforcementLog",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyEnforcementLog_CreatedAt",
                schema: "Compliance",
                table: "PolicyEnforcementLog",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyEnforcementLog_CreatedByUserId",
                schema: "Compliance",
                table: "PolicyEnforcementLog",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyEnforcementLog_IsActive",
                schema: "Compliance",
                table: "PolicyEnforcementLog",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyEnforcementLog_IsDeleted",
                schema: "Compliance",
                table: "PolicyEnforcementLog",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyEnforcementLog_PolicyTypeId",
                schema: "Compliance",
                table: "PolicyEnforcementLog",
                column: "PolicyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyEnforcementLog_Status",
                schema: "Compliance",
                table: "PolicyEnforcementLog",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_PolicyType_Code",
                schema: "Compliance",
                table: "PolicyType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PolicyType_CreatedAt",
                schema: "Compliance",
                table: "PolicyType",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyType_CreatedByUserId",
                schema: "Compliance",
                table: "PolicyType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyType_IsActive",
                schema: "Compliance",
                table: "PolicyType",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyType_IsDeleted",
                schema: "Compliance",
                table: "PolicyType",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyType_Status",
                schema: "Compliance",
                table: "PolicyType",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccess_CreatedAt",
                schema: "Access",
                table: "PricingPlanAccess",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccess_CreatedByUserId",
                schema: "Access",
                table: "PricingPlanAccess",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccess_IsActive",
                schema: "Access",
                table: "PricingPlanAccess",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccess_IsDeleted",
                schema: "Access",
                table: "PricingPlanAccess",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccess_PricingPlanId",
                schema: "Access",
                table: "PricingPlanAccess",
                column: "PricingPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccess_RoleId",
                schema: "Access",
                table: "PricingPlanAccess",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccess_Status",
                schema: "Access",
                table: "PricingPlanAccess",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccessDetail_CreatedAt",
                schema: "Access",
                table: "PricingPlanAccessDetail",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccessDetail_CreatedByUserId",
                schema: "Access",
                table: "PricingPlanAccessDetail",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccessDetail_IsActive",
                schema: "Access",
                table: "PricingPlanAccessDetail",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccessDetail_IsDeleted",
                schema: "Access",
                table: "PricingPlanAccessDetail",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccessDetail_MenuId",
                schema: "Access",
                table: "PricingPlanAccessDetail",
                column: "MenuId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccessDetail_PricingPlanAccessId",
                schema: "Access",
                table: "PricingPlanAccessDetail",
                column: "PricingPlanAccessId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanAccessDetail_Status",
                schema: "Access",
                table: "PricingPlanAccessDetail",
                columns: new[] { "IsActive", "IsDeleted" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Actions",
                schema: "Access");

            migrationBuilder.DropTable(
                name: "FeaturePolicyAccess",
                schema: "Access");

            migrationBuilder.DropTable(
                name: "LicenseAccessDetails",
                schema: "Access");

            migrationBuilder.DropTable(
                name: "PolicyConfigurationAudit",
                schema: "Compliance");

            migrationBuilder.DropTable(
                name: "PolicyEnforcementLog",
                schema: "Compliance");

            migrationBuilder.DropTable(
                name: "PolicyType",
                schema: "Compliance");

            migrationBuilder.DropTable(
                name: "PricingPlanAccessDetail",
                schema: "Access");

            migrationBuilder.DropTable(
                name: "LicenseAccesses",
                schema: "Access");

            migrationBuilder.DropTable(
                name: "PricingPlanAccess",
                schema: "Access");

            migrationBuilder.DropIndex(
                name: "IX_Role_CreatedAt",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Role_CreatedByUserId",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Role_IsActive",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Role_IsDeleted",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Role_Status",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "UX_Role_Code",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistoryArchive_CreatedAt",
                schema: "Auth",
                table: "LoginHistoryArchive");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistoryArchive_CreatedByUserId",
                schema: "Auth",
                table: "LoginHistoryArchive");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistoryArchive_IsActive",
                schema: "Auth",
                table: "LoginHistoryArchive");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistoryArchive_IsDeleted",
                schema: "Auth",
                table: "LoginHistoryArchive");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistoryArchive_Status",
                schema: "Auth",
                table: "LoginHistoryArchive");

            migrationBuilder.DropIndex(
                name: "IX_LoginHistoryArchive_UserRoleId",
                schema: "Auth",
                table: "LoginHistoryArchive");

            migrationBuilder.DropColumn(
                name: "AuthorizationRequired",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "Code",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "Description",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "IsMobileRequest",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                schema: "Access",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Access",
                table: "Roles");

            migrationBuilder.EnsureSchema(
                name: "Seguridad");

            migrationBuilder.RenameTable(
                name: "Roles",
                schema: "Access",
                newName: "Roles",
                newSchema: "Auth");

            migrationBuilder.RenameTable(
                name: "LoginHistoryArchive",
                schema: "Auth",
                newName: "LoginHistoryArchive",
                newSchema: "Seguridad");

            migrationBuilder.RenameTable(
                name: "LoginHistory",
                schema: "Auth",
                newName: "LoginHistory",
                newSchema: "Seguridad");

            migrationBuilder.RenameTable(
                name: "LoginFailed",
                schema: "Auth",
                newName: "LoginFailed",
                newSchema: "Seguridad");

            migrationBuilder.RenameTable(
                name: "ForgotPassword",
                schema: "Auth",
                newName: "ForgotPassword",
                newSchema: "Seguridad");

            migrationBuilder.RenameTable(
                name: "AccessAuthorization",
                schema: "Access",
                newName: "AccessAuthorization",
                newSchema: "Seguridad");

            migrationBuilder.RenameColumn(
                name: "UserId",
                schema: "Auth",
                table: "RefreshTokens",
                newName: "AppUserId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "Auth",
                table: "Roles",
                type: "varchar(256)",
                unicode: false,
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldUnicode: false,
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                schema: "Auth",
                table: "Roles",
                type: "varchar(max)",
                unicode: false,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedName",
                schema: "Auth",
                table: "Roles",
                type: "varchar(256)",
                unicode: false,
                maxLength: 256,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsMobileRequest",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);

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
                name: "DeletedAt",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "LoginHistoryArchive",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClaimType = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ClaimValue = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    RoleId = table.Column<int>(type: "int", nullable: false)
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
                name: "Users",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    DisplayName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Email = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    NormalizedEmail = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: true),
                    PasswordHash = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    PhoneNumber = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    SecurityStamp = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    UserName = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                schema: "Auth",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClaimType = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ClaimValue = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false)
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
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    CustomProperties = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    DateFormat = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "dd/MM/yyyy"),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DefaultCurrency = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "USD"),
                    DefaultPageSize = table.Column<int>(type: "int", nullable: true, defaultValue: 25),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    EmailNotifications = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    FirstName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Gender = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    LastLoginDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    LastPasswordChange = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NumberFormat = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "en-US"),
                    PreferredContactMethod = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true, defaultValue: "Email"),
                    PreferredContactTime = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    PreferredLanguage = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true, defaultValue: "es-ES"),
                    ReceiveNewsletters = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    ReceivePromotionalEmails = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    ReceiveSystemUpdates = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    RequirePasswordChange = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    SessionTimeoutMinutes = table.Column<int>(type: "int", nullable: true, defaultValue: 60),
                    ShowAdvancedFeatures = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    SmsNotifications = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Theme = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true, defaultValue: "light"),
                    TimeFormat = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "HH:mm"),
                    TimeZone = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true, defaultValue: "America/Guayaquil"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    WhatsAppNotifications = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
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
                name: "RoleNameIndex",
                schema: "Auth",
                table: "Roles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_RoleId",
                schema: "Auth",
                table: "RoleClaims",
                column: "RoleId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_RefreshTokens_Users_AppUserId",
                schema: "Auth",
                table: "RefreshTokens",
                column: "AppUserId",
                principalSchema: "Auth",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
