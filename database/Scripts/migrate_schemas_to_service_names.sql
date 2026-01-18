-- Schema alignment migration script
-- Run this script to create new schemas and migrate tables from old schemas
-- IMPORTANT: Run in a transaction and test in staging first!

BEGIN TRANSACTION;

-- Create new schemas if they don't exist
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Identity')
    EXEC('CREATE SCHEMA [Identity]');

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Configuration')
    EXEC('CREATE SCHEMA [Configuration]');

-- =============================================
-- IDENTITY SERVICE: Seguridad/Auth/Audit -> Identity
-- =============================================

-- Tables from Seguridad schema
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[AccessAuthorization];
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[Actions];
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[FeaturePolicyAccess];
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[ForgotPassword];
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[LicenciaAcceso];
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[LicenciaAccesoDetalle];
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[LoginFailed];
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[LoginHistory];
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[LoginHistoryArchive];
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[PricingPlanAccess];
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[PricingPlanAccessDetail];
ALTER SCHEMA [Identity] TRANSFER [Seguridad].[Role];

-- Tables from Auth schema
ALTER SCHEMA [Identity] TRANSFER [Auth].[UserProfile];

-- Tables from Audit schema (if they exist)
IF EXISTS (SELECT * FROM sys.tables WHERE schema_id = SCHEMA_ID('Audit') AND name = 'PolicyConfigurationAudit')
    ALTER SCHEMA [Identity] TRANSFER [Audit].[PolicyConfigurationAudit];

IF EXISTS (SELECT * FROM sys.tables WHERE schema_id = SCHEMA_ID('Audit') AND name = 'PolicyEnforcementLog')
    ALTER SCHEMA [Identity] TRANSFER [Audit].[PolicyEnforcementLog];

-- PolicyType (new table, create if not exists)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE schema_id = SCHEMA_ID('Identity') AND name = 'PolicyType')
BEGIN
    CREATE TABLE [Identity].[PolicyType] (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Code NVARCHAR(50) NOT NULL,
        Name NVARCHAR(250) NOT NULL,
        Description NVARCHAR(500) NULL,
        DataType NVARCHAR(50) NOT NULL,
        DefaultValue NVARCHAR(100) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        IsDeleted BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CreatedByUserId INT NULL,
        UpdatedAt DATETIME2 NULL,
        UpdatedByUserId INT NULL,
        DeletedAt DATETIME2 NULL,
        DeletedByUserId INT NULL
    );

    CREATE UNIQUE INDEX IX_PolicyType_Code ON [Identity].[PolicyType](Code);
END

-- =============================================
-- CONFIGURATION SERVICE: Config -> Configuration
-- =============================================

ALTER SCHEMA [Configuration] TRANSFER [Config].[Aplicacion];
ALTER SCHEMA [Configuration] TRANSFER [Config].[Company];
ALTER SCHEMA [Configuration] TRANSFER [Config].[CompanyDemoStep];
ALTER SCHEMA [Configuration] TRANSFER [Config].[CompanyPolicyOverride];
ALTER SCHEMA [Configuration] TRANSFER [Config].[DemoStep];
ALTER SCHEMA [Configuration] TRANSFER [Config].[Ec2Instance];
ALTER SCHEMA [Configuration] TRANSFER [Config].[EstablecimientoLogo];
ALTER SCHEMA [Configuration] TRANSFER [Config].[Licencia];
ALTER SCHEMA [Configuration] TRANSFER [Config].[LicenciaDetalle];
ALTER SCHEMA [Configuration] TRANSFER [Config].[LicensePolicyConfiguration];
ALTER SCHEMA [Configuration] TRANSFER [Config].[LicenseType];
ALTER SCHEMA [Configuration] TRANSFER [Config].[Menu];
ALTER SCHEMA [Configuration] TRANSFER [Config].[MenuAction];
ALTER SCHEMA [Configuration] TRANSFER [Config].[Printer];
ALTER SCHEMA [Configuration] TRANSFER [Config].[PrinterDocument];
ALTER SCHEMA [Configuration] TRANSFER [Config].[PrinterType];
ALTER SCHEMA [Configuration] TRANSFER [Config].[Reports];
ALTER SCHEMA [Configuration] TRANSFER [Config].[Sistema];
ALTER SCHEMA [Configuration] TRANSFER [Config].[SubscriptionType];

-- ScheduleCompany (new table, create if not exists)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE schema_id = SCHEMA_ID('Configuration') AND name = 'ScheduleCompany')
BEGIN
    CREATE TABLE [Configuration].[ScheduleCompany] (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ScheduleId INT NOT NULL,
        CompanyId INT NOT NULL,
        StartTime TIME(7) NOT NULL,
        EndTime TIME(7) NOT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        IsDeleted BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CreatedByUserId INT NULL,
        UpdatedAt DATETIME2 NULL,
        UpdatedByUserId INT NULL,
        DeletedAt DATETIME2 NULL,
        DeletedByUserId INT NULL,
        CONSTRAINT FK_ScheduleCompany_Company FOREIGN KEY (CompanyId) REFERENCES [Configuration].[Company](Id)
    );

    CREATE UNIQUE INDEX IX_ScheduleCompany_Company_Schedule ON [Configuration].[ScheduleCompany](CompanyId, ScheduleId);
END

-- =============================================
-- CREATE CROSS-SERVICE VIEW
-- =============================================

IF EXISTS (SELECT * FROM sys.views WHERE name = 'vw_MenuAction')
    DROP VIEW [Configuration].[vw_MenuAction];
GO

CREATE VIEW [Configuration].[vw_MenuAction]
AS
SELECT
    ma.Id,
    ma.MenuId,
    m.Name AS MenuName,
    ma.ActionId,
    a.Code AS ActionCode,
    a.Name AS ActionName,
    ma.IsActive,
    ma.CreatedAt
FROM Configuration.MenuAction ma
INNER JOIN Configuration.Menu m ON ma.MenuId = m.Id
INNER JOIN Identity.Actions a ON ma.ActionId = a.Id
WHERE ma.IsDeleted = 0;
GO

COMMIT TRANSACTION;

PRINT 'Schema migration completed successfully!';
PRINT 'Old schemas (Seguridad, Auth, Audit, Config) can be dropped after verification.';
