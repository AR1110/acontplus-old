using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Configuration.Infrastructure.Persistence.Migrations
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
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.EnsureSchema(
                name: "Configuration");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Config",
                table: "PrinterType",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Config",
                table: "PrinterDocument",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Config",
                table: "Printer",
                newName: "IsMobileRequest");

            migrationBuilder.RenameColumn(
                name: "FromMobile",
                schema: "Config",
                table: "EstablecimientoLogo",
                newName: "IsMobileRequest");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "PrinterType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "PrinterType",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "PrinterType",
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
                table: "PrinterType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Config",
                table: "PrinterType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Config",
                table: "PrinterType",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "PrinterDocument",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "PrinterDocument",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "PrinterDocument",
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
                table: "PrinterDocument",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Config",
                table: "PrinterDocument",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Config",
                table: "PrinterDocument",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "Printer",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "Printer",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "Printer",
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
                table: "Printer",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Config",
                table: "Printer",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Config",
                table: "Printer",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(300)",
                oldUnicode: false,
                oldMaxLength: 300,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "datetime2(7)",
                precision: 7,
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "datetime2(7)",
                precision: 7,
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<byte[]>(
                name: "Content",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0],
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Company",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Uuid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdCard = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    BusinessName = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    TradeName = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    Email = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    Telephone = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Address = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
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
                    table.PrimaryKey("PK_Company", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Days",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    NumberDay = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Days", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DemoStep",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    Mandatory = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
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
                    table.PrimaryKey("PK_DemoStep", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ec2Instance",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Region = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    InstanceId = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    InstanceName = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    InstanceType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    IpAddress = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    UrlStart = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    UrlStop = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
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
                    table.PrimaryKey("PK_Ec2Instance", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LicenseType",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
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
                    table.PrimaryKey("PK_LicenseType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    FileName = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: false),
                    ReportPath = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: false),
                    Query = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
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
                    table.PrimaryKey("PK_Reports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionType",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    Duration = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_SubscriptionType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Systems",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    DomainUrl = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    IpAddress = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    ConnectionStrings = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: true),
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
                    table.PrimaryKey("PK_Systems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "vw_MenuAction",
                schema: "Configuration",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    MenuId = table.Column<int>(type: "int", nullable: false),
                    MenuName = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    ActionId = table.Column<int>(type: "int", nullable: false),
                    ActionCode = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    ActionName = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "CompanyPolicyOverride",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    PolicyTypeId = table.Column<int>(type: "int", nullable: false),
                    PolicyValue = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
                    OverrideReason = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true),
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
                    table.PrimaryKey("PK_CompanyPolicyOverride", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompanyPolicyOverride_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalSchema: "Config",
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WhatsAppUsage",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    Used = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Limit = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Unlimited = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
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
                    table.PrimaryKey("PK_WhatsAppUsage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WhatsAppUsage_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalSchema: "Config",
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Schedule",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DayId = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "TIME(7)", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "TIME(7)", nullable: false),
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
                    table.PrimaryKey("PK_Schedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Schedule_Days_DayId",
                        column: x => x.DayId,
                        principalSchema: "Config",
                        principalTable: "Days",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CompanyDemoStep",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DemoStepId = table.Column<int>(type: "int", nullable: false),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    Uuid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
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
                    table.PrimaryKey("PK_CompanyDemoStep", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompanyDemoStep_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalSchema: "Config",
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompanyDemoStep_DemoStep_DemoStepId",
                        column: x => x.DemoStepId,
                        principalSchema: "Config",
                        principalTable: "DemoStep",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LicensePolicyConfiguration",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LicenseTypeId = table.Column<int>(type: "int", nullable: false),
                    PolicyTypeId = table.Column<int>(type: "int", nullable: false),
                    PolicyValue = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
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
                    table.PrimaryKey("PK_LicensePolicyConfiguration", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LicensePolicyConfiguration_LicenseType_LicenseTypeId",
                        column: x => x.LicenseTypeId,
                        principalSchema: "Config",
                        principalTable: "LicenseType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Licenses",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: false),
                    LicenseTypeId = table.Column<int>(type: "int", nullable: false),
                    TaxId = table.Column<int>(type: "int", nullable: true),
                    TaxPercentId = table.Column<int>(type: "int", nullable: true),
                    Cost = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    Tax = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    Discount = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    Total = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
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
                    table.PrimaryKey("PK_Licenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Licenses_LicenseType_LicenseTypeId",
                        column: x => x.LicenseTypeId,
                        principalSchema: "Config",
                        principalTable: "LicenseType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Applications",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    SystemId = table.Column<int>(type: "int", nullable: false),
                    DomainUrl = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    IpAddress = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    ConnectionStrings = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: true),
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
                    table.PrimaryKey("PK_Applications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Applications_Systems_SystemId",
                        column: x => x.SystemId,
                        principalSchema: "Config",
                        principalTable: "Systems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ScheduleCompany",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScheduleId = table.Column<int>(type: "int", nullable: false),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "TIME(7)", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "TIME(7)", nullable: false),
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
                    table.PrimaryKey("PK_ScheduleCompany", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScheduleCompany_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalSchema: "Config",
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ScheduleCompany_Schedule_ScheduleId",
                        column: x => x.ScheduleId,
                        principalSchema: "Config",
                        principalTable: "Schedule",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LicenseDetails",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LicenseId = table.Column<int>(type: "int", nullable: false),
                    ApplicationId = table.Column<int>(type: "int", nullable: false),
                    TaxId = table.Column<int>(type: "int", nullable: true),
                    TaxPercentId = table.Column<int>(type: "int", nullable: true),
                    Cost = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    Tax = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    Discount = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    Total = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
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
                    table.PrimaryKey("PK_LicenseDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LicenseDetails_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalSchema: "Config",
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LicenseDetails_Licenses_LicenseId",
                        column: x => x.LicenseId,
                        principalSchema: "Config",
                        principalTable: "Licenses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Menu",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApplicationId = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Icon = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: true),
                    Name = table.Column<string>(type: "varchar(60)", unicode: false, maxLength: 60, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    Url = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    ParentId = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_Menu", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Menu_Applications_ApplicationId",
                        column: x => x.ApplicationId,
                        principalSchema: "Config",
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Menu_Menu_ParentId",
                        column: x => x.ParentId,
                        principalSchema: "Config",
                        principalTable: "Menu",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MenuAction",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MenuId = table.Column<int>(type: "int", nullable: false),
                    ActionId = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_MenuAction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuAction_Menu_MenuId",
                        column: x => x.MenuId,
                        principalSchema: "Config",
                        principalTable: "Menu",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PrinterType_CreatedAt",
                schema: "Config",
                table: "PrinterType",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterType_CreatedByUserId",
                schema: "Config",
                table: "PrinterType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterType_IsActive",
                schema: "Config",
                table: "PrinterType",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterType_IsDeleted",
                schema: "Config",
                table: "PrinterType",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterType_Status",
                schema: "Config",
                table: "PrinterType",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_PrinterDocument_CreatedAt",
                schema: "Config",
                table: "PrinterDocument",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterDocument_CreatedByUserId",
                schema: "Config",
                table: "PrinterDocument",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterDocument_IsActive",
                schema: "Config",
                table: "PrinterDocument",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterDocument_IsDeleted",
                schema: "Config",
                table: "PrinterDocument",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterDocument_Status",
                schema: "Config",
                table: "PrinterDocument",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Printer_CreatedAt",
                schema: "Config",
                table: "Printer",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Printer_CreatedByUserId",
                schema: "Config",
                table: "Printer",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Printer_IsActive",
                schema: "Config",
                table: "Printer",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Printer_IsDeleted",
                schema: "Config",
                table: "Printer",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Printer_Status",
                schema: "Config",
                table: "Printer",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_EstablecimientoLogo_CreatedAt",
                schema: "Config",
                table: "EstablecimientoLogo",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_EstablecimientoLogo_CreatedByUserId",
                schema: "Config",
                table: "EstablecimientoLogo",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_EstablecimientoLogo_IsActive",
                schema: "Config",
                table: "EstablecimientoLogo",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_EstablecimientoLogo_IsDeleted",
                schema: "Config",
                table: "EstablecimientoLogo",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_EstablecimientoLogo_Status",
                schema: "Config",
                table: "EstablecimientoLogo",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Applications_CreatedAt",
                schema: "Config",
                table: "Applications",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_CreatedByUserId",
                schema: "Config",
                table: "Applications",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_IsActive",
                schema: "Config",
                table: "Applications",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_IsDeleted",
                schema: "Config",
                table: "Applications",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_Status",
                schema: "Config",
                table: "Applications",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Applications_SystemId",
                schema: "Config",
                table: "Applications",
                column: "SystemId");

            migrationBuilder.CreateIndex(
                name: "UX_Applications_Code",
                schema: "Config",
                table: "Applications",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Company_CreatedAt",
                schema: "Config",
                table: "Company",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Company_CreatedByUserId",
                schema: "Config",
                table: "Company",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Company_IsActive",
                schema: "Config",
                table: "Company",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Company_IsDeleted",
                schema: "Config",
                table: "Company",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Company_Status",
                schema: "Config",
                table: "Company",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_Company_IdCard",
                schema: "Config",
                table: "Company",
                column: "IdCard",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompanyDemoStep_CompanyId",
                schema: "Config",
                table: "CompanyDemoStep",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyDemoStep_CreatedAt",
                schema: "Config",
                table: "CompanyDemoStep",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyDemoStep_CreatedByUserId",
                schema: "Config",
                table: "CompanyDemoStep",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyDemoStep_DemoStepId",
                schema: "Config",
                table: "CompanyDemoStep",
                column: "DemoStepId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyDemoStep_IsActive",
                schema: "Config",
                table: "CompanyDemoStep",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyDemoStep_IsDeleted",
                schema: "Config",
                table: "CompanyDemoStep",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyDemoStep_Status",
                schema: "Config",
                table: "CompanyDemoStep",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyPolicyOverride_Company_Policy",
                schema: "Config",
                table: "CompanyPolicyOverride",
                columns: new[] { "CompanyId", "PolicyTypeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompanyPolicyOverride_CreatedAt",
                schema: "Config",
                table: "CompanyPolicyOverride",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyPolicyOverride_CreatedByUserId",
                schema: "Config",
                table: "CompanyPolicyOverride",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyPolicyOverride_IsActive",
                schema: "Config",
                table: "CompanyPolicyOverride",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyPolicyOverride_IsDeleted",
                schema: "Config",
                table: "CompanyPolicyOverride",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyPolicyOverride_Status",
                schema: "Config",
                table: "CompanyPolicyOverride",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_Days_NumberDay",
                schema: "Config",
                table: "Days",
                column: "NumberDay",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DemoStep_CreatedAt",
                schema: "Config",
                table: "DemoStep",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_DemoStep_CreatedByUserId",
                schema: "Config",
                table: "DemoStep",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DemoStep_IsActive",
                schema: "Config",
                table: "DemoStep",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_DemoStep_IsDeleted",
                schema: "Config",
                table: "DemoStep",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_DemoStep_Status",
                schema: "Config",
                table: "DemoStep",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Ec2Instance_CreatedAt",
                schema: "Config",
                table: "Ec2Instance",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Ec2Instance_CreatedByUserId",
                schema: "Config",
                table: "Ec2Instance",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Ec2Instance_IsActive",
                schema: "Config",
                table: "Ec2Instance",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Ec2Instance_IsDeleted",
                schema: "Config",
                table: "Ec2Instance",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Ec2Instance_Status",
                schema: "Config",
                table: "Ec2Instance",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_Ec2Instance_Id",
                schema: "Config",
                table: "Ec2Instance",
                column: "InstanceId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LicenseDetails_ApplicationId",
                schema: "Config",
                table: "LicenseDetails",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseDetails_CreatedAt",
                schema: "Config",
                table: "LicenseDetails",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseDetails_CreatedByUserId",
                schema: "Config",
                table: "LicenseDetails",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseDetails_IsActive",
                schema: "Config",
                table: "LicenseDetails",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseDetails_IsDeleted",
                schema: "Config",
                table: "LicenseDetails",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseDetails_LicenseId",
                schema: "Config",
                table: "LicenseDetails",
                column: "LicenseId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseDetails_Status",
                schema: "Config",
                table: "LicenseDetails",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_LicensePolicyConfiguration_CreatedAt",
                schema: "Config",
                table: "LicensePolicyConfiguration",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_LicensePolicyConfiguration_CreatedByUserId",
                schema: "Config",
                table: "LicensePolicyConfiguration",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LicensePolicyConfiguration_IsActive",
                schema: "Config",
                table: "LicensePolicyConfiguration",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LicensePolicyConfiguration_IsDeleted",
                schema: "Config",
                table: "LicensePolicyConfiguration",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LicensePolicyConfiguration_LicenseType_Policy",
                schema: "Config",
                table: "LicensePolicyConfiguration",
                columns: new[] { "LicenseTypeId", "PolicyTypeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LicensePolicyConfiguration_Status",
                schema: "Config",
                table: "LicensePolicyConfiguration",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_CreatedAt",
                schema: "Config",
                table: "Licenses",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_CreatedByUserId",
                schema: "Config",
                table: "Licenses",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_IsActive",
                schema: "Config",
                table: "Licenses",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_IsDeleted",
                schema: "Config",
                table: "Licenses",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_LicenseTypeId",
                schema: "Config",
                table: "Licenses",
                column: "LicenseTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Licenses_Status",
                schema: "Config",
                table: "Licenses",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_Licenses_Code",
                schema: "Config",
                table: "Licenses",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LicenseType_CreatedAt",
                schema: "Config",
                table: "LicenseType",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseType_CreatedByUserId",
                schema: "Config",
                table: "LicenseType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseType_IsActive",
                schema: "Config",
                table: "LicenseType",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseType_IsDeleted",
                schema: "Config",
                table: "LicenseType",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_LicenseType_Status",
                schema: "Config",
                table: "LicenseType",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_License_Type_Code",
                schema: "Config",
                table: "LicenseType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Menu_ApplicationId",
                schema: "Config",
                table: "Menu",
                column: "ApplicationId");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_CreatedAt",
                schema: "Config",
                table: "Menu",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_CreatedByUserId",
                schema: "Config",
                table: "Menu",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_IsActive",
                schema: "Config",
                table: "Menu",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_IsDeleted",
                schema: "Config",
                table: "Menu",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_ParentId",
                schema: "Config",
                table: "Menu",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_Status",
                schema: "Config",
                table: "Menu",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_Menu_Code",
                schema: "Config",
                table: "Menu",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MenuAction_CreatedAt",
                schema: "Config",
                table: "MenuAction",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MenuAction_CreatedByUserId",
                schema: "Config",
                table: "MenuAction",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuAction_IsActive",
                schema: "Config",
                table: "MenuAction",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_MenuAction_IsDeleted",
                schema: "Config",
                table: "MenuAction",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MenuAction_MenuId",
                schema: "Config",
                table: "MenuAction",
                column: "MenuId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuAction_Status",
                schema: "Config",
                table: "MenuAction",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Report_CreatedAt",
                schema: "Config",
                table: "Reports",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Report_CreatedByUserId",
                schema: "Config",
                table: "Reports",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Report_IsActive",
                schema: "Config",
                table: "Reports",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Report_IsDeleted",
                schema: "Config",
                table: "Reports",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Report_Status",
                schema: "Config",
                table: "Reports",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_Report_Code",
                schema: "Config",
                table: "Reports",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_CreatedAt",
                schema: "Config",
                table: "Schedule",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_CreatedByUserId",
                schema: "Config",
                table: "Schedule",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_DayId",
                schema: "Config",
                table: "Schedule",
                column: "DayId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_IsActive",
                schema: "Config",
                table: "Schedule",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_IsDeleted",
                schema: "Config",
                table: "Schedule",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_Status",
                schema: "Config",
                table: "Schedule",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleCompany_Company_Schedule",
                schema: "Config",
                table: "ScheduleCompany",
                columns: new[] { "CompanyId", "ScheduleId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleCompany_CreatedAt",
                schema: "Config",
                table: "ScheduleCompany",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleCompany_CreatedByUserId",
                schema: "Config",
                table: "ScheduleCompany",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleCompany_IsActive",
                schema: "Config",
                table: "ScheduleCompany",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleCompany_IsDeleted",
                schema: "Config",
                table: "ScheduleCompany",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleCompany_ScheduleId",
                schema: "Config",
                table: "ScheduleCompany",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleCompany_Status",
                schema: "Config",
                table: "ScheduleCompany",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionType_CreatedAt",
                schema: "Config",
                table: "SubscriptionType",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionType_CreatedByUserId",
                schema: "Config",
                table: "SubscriptionType",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionType_IsActive",
                schema: "Config",
                table: "SubscriptionType",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionType_IsDeleted",
                schema: "Config",
                table: "SubscriptionType",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionType_Status",
                schema: "Config",
                table: "SubscriptionType",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_Subscription_Type_Code",
                schema: "Config",
                table: "SubscriptionType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Systems_CreatedAt",
                schema: "Config",
                table: "Systems",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Systems_CreatedByUserId",
                schema: "Config",
                table: "Systems",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Systems_IsActive",
                schema: "Config",
                table: "Systems",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Systems_IsDeleted",
                schema: "Config",
                table: "Systems",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Systems_Status",
                schema: "Config",
                table: "Systems",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_Systems_Code",
                schema: "Config",
                table: "Systems",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppUsage_CreatedAt",
                schema: "Config",
                table: "WhatsAppUsage",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppUsage_CreatedByUserId",
                schema: "Config",
                table: "WhatsAppUsage",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppUsage_IsActive",
                schema: "Config",
                table: "WhatsAppUsage",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppUsage_IsDeleted",
                schema: "Config",
                table: "WhatsAppUsage",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppUsage_Status",
                schema: "Config",
                table: "WhatsAppUsage",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_WhatsAppUsage_CompanyId",
                schema: "Config",
                table: "WhatsAppUsage",
                column: "CompanyId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyDemoStep",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "CompanyPolicyOverride",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "Ec2Instance",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "LicenseDetails",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "LicensePolicyConfiguration",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "MenuAction",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "Reports",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "ScheduleCompany",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "SubscriptionType",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "vw_MenuAction",
                schema: "Configuration");

            migrationBuilder.DropTable(
                name: "WhatsAppUsage",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "DemoStep",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "Licenses",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "Menu",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "Schedule",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "Company",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "LicenseType",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "Applications",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "Days",
                schema: "Config");

            migrationBuilder.DropTable(
                name: "Systems",
                schema: "Config");

            migrationBuilder.DropIndex(
                name: "IX_PrinterType_CreatedAt",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropIndex(
                name: "IX_PrinterType_CreatedByUserId",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropIndex(
                name: "IX_PrinterType_IsActive",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropIndex(
                name: "IX_PrinterType_IsDeleted",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropIndex(
                name: "IX_PrinterType_Status",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropIndex(
                name: "IX_PrinterDocument_CreatedAt",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropIndex(
                name: "IX_PrinterDocument_CreatedByUserId",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropIndex(
                name: "IX_PrinterDocument_IsActive",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropIndex(
                name: "IX_PrinterDocument_IsDeleted",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropIndex(
                name: "IX_PrinterDocument_Status",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropIndex(
                name: "IX_Printer_CreatedAt",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropIndex(
                name: "IX_Printer_CreatedByUserId",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropIndex(
                name: "IX_Printer_IsActive",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropIndex(
                name: "IX_Printer_IsDeleted",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropIndex(
                name: "IX_Printer_Status",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropIndex(
                name: "IX_EstablecimientoLogo_CreatedAt",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropIndex(
                name: "IX_EstablecimientoLogo_CreatedByUserId",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropIndex(
                name: "IX_EstablecimientoLogo_IsActive",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropIndex(
                name: "IX_EstablecimientoLogo_IsDeleted",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropIndex(
                name: "IX_EstablecimientoLogo_Status",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Config",
                table: "PrinterType");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Config",
                table: "PrinterDocument");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Config",
                table: "Printer");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "Config",
                table: "EstablecimientoLogo");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Config",
                table: "PrinterType",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Config",
                table: "PrinterDocument",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Config",
                table: "Printer",
                newName: "FromMobile");

            migrationBuilder.RenameColumn(
                name: "IsMobileRequest",
                schema: "Config",
                table: "EstablecimientoLogo",
                newName: "FromMobile");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "PrinterType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "PrinterType",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "PrinterType",
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
                table: "PrinterType",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "PrinterType",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Config",
                table: "PrinterType",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "PrinterDocument",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "PrinterDocument",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "PrinterDocument",
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
                table: "PrinterDocument",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "PrinterDocument",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Config",
                table: "PrinterDocument",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "Printer",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "Printer",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "Printer",
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
                table: "Printer",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "Printer",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Config",
                table: "Printer",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(300)",
                oldUnicode: false,
                oldMaxLength: 300);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DeletedAt",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "SYSUTCDATETIME()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2(7)",
                oldPrecision: 7,
                oldDefaultValueSql: "SYSUTCDATETIME()");

            migrationBuilder.AlterColumn<byte[]>(
                name: "Content",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "varbinary(max)",
                nullable: true,
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Config",
                table: "EstablecimientoLogo",
                type: "int",
                nullable: true);
        }
    }
}
