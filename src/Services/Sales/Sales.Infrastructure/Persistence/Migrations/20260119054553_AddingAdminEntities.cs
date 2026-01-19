using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sales.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddingAdminEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Sales");

            migrationBuilder.CreateTable(
                name: "ConsumptionPackage",
                schema: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Code = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    ConsumptionType = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Unit = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    BasePrice = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: false),
                    OverageRate = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    DiscountRate = table.Column<decimal>(type: "numeric(5,2)", precision: 18, scale: 2, nullable: true),
                    AllowOverage = table.Column<bool>(type: "bit", nullable: false),
                    OverageLimit = table.Column<int>(type: "int", nullable: true),
                    OverageBudget = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    ResetPeriod = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    AutoReset = table.Column<bool>(type: "bit", nullable: false),
                    GracePeriodDays = table.Column<int>(type: "int", nullable: true),
                    IsAddOn = table.Column<bool>(type: "bit", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_ConsumptionPackage", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Coupon",
                schema: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Discount = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    Percent = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
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
                    table.PrimaryKey("PK_Coupon", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PricingPlan",
                schema: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    LicenseTypeId = table.Column<int>(type: "int", nullable: false),
                    SubscriptionTypeId = table.Column<int>(type: "int", nullable: false),
                    BasePrice = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: false),
                    TaxRate = table.Column<decimal>(type: "numeric(5,2)", precision: 18, scale: 2, nullable: true),
                    DiscountRate = table.Column<decimal>(type: "numeric(5,2)", precision: 18, scale: 2, nullable: true),
                    IsTrial = table.Column<bool>(type: "bit", nullable: false),
                    TrialDays = table.Column<int>(type: "int", nullable: true),
                    RequireCreditCardForTrial = table.Column<bool>(type: "bit", nullable: false),
                    AutoConvertToPaid = table.Column<bool>(type: "bit", nullable: false),
                    MaxTrialExtensions = table.Column<int>(type: "int", nullable: true),
                    TrialExtensionCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    IsConsumptionBased = table.Column<bool>(type: "bit", nullable: false),
                    ConsumptionModel = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    AllowOverage = table.Column<bool>(type: "bit", nullable: false),
                    OverageRate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    IsCustomPlan = table.Column<bool>(type: "bit", nullable: false),
                    MaxCompanies = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_PricingPlan", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PricingPlanFeature",
                schema: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PricingPlanId = table.Column<int>(type: "int", nullable: false),
                    ApplicationId = table.Column<int>(type: "int", nullable: false),
                    ConsumptionPackageId = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
                    IsAddOn = table.Column<bool>(type: "bit", nullable: false),
                    IsConsumptionBased = table.Column<bool>(type: "bit", nullable: false),
                    ConsumptionType = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ConsumptionLimit = table.Column<int>(type: "int", nullable: true),
                    ConsumptionPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    ConsumptionResetPeriod = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    MaxQuantity = table.Column<int>(type: "int", nullable: true),
                    AllowOverage = table.Column<bool>(type: "bit", nullable: false),
                    OverageRate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    OverageLimit = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    OverridePrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    OverrideTaxRate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
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
                    table.PrimaryKey("PK_PricingPlanFeature", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PricingPlanFeature_ConsumptionPackage_ConsumptionPackageId",
                        column: x => x.ConsumptionPackageId,
                        principalSchema: "Sales",
                        principalTable: "ConsumptionPackage",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_PricingPlanFeature_PricingPlan_PricingPlanId",
                        column: x => x.PricingPlanId,
                        principalSchema: "Sales",
                        principalTable: "PricingPlan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Subscription",
                schema: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PricingPlanId = table.Column<int>(type: "int", nullable: false),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaxPaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RenewalCount = table.Column<int>(type: "int", nullable: false),
                    LastRenewalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NextRenewalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RenewalReason = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    PreviousPricingPlanId = table.Column<int>(type: "int", nullable: true),
                    PlanChangeDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlanChangeReason = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Cost = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    Tax = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    Discount = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    Total = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    Paid = table.Column<bool>(type: "bit", nullable: true),
                    IsTrial = table.Column<bool>(type: "bit", nullable: false),
                    TrialExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AutoRenew = table.Column<bool>(type: "bit", nullable: false),
                    TrialExtensionsUsed = table.Column<int>(type: "int", nullable: false),
                    IsConsumptionBased = table.Column<bool>(type: "bit", nullable: false),
                    AllowOverage = table.Column<bool>(type: "bit", nullable: false),
                    OverageBudget = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    TotalOverageCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    WarningMessage = table.Column<string>(type: "varchar(1500)", unicode: false, maxLength: 1500, nullable: true),
                    LastRenewalOldEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastRenewalNewEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastRenewalReason = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    LastPlanChangeOldPricingPlanId = table.Column<int>(type: "int", nullable: true),
                    LastPlanChangeNewPricingPlanId = table.Column<int>(type: "int", nullable: true),
                    LastPlanChangeReason = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
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
                    table.PrimaryKey("PK_Subscription", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subscription_PricingPlan_PreviousPricingPlanId",
                        column: x => x.PreviousPricingPlanId,
                        principalSchema: "Sales",
                        principalTable: "PricingPlan",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Subscription_PricingPlan_PricingPlanId",
                        column: x => x.PricingPlanId,
                        principalSchema: "Sales",
                        principalTable: "PricingPlan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FeaturePolicyConfiguration",
                schema: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PricingPlanFeatureId = table.Column<int>(type: "int", nullable: false),
                    PolicyTypeId = table.Column<int>(type: "int", nullable: false),
                    ConsumptionPolicy = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ConsumptionLimit = table.Column<int>(type: "int", nullable: true),
                    WarningThreshold = table.Column<int>(type: "int", nullable: true),
                    GracePeriodDays = table.Column<int>(type: "int", nullable: true),
                    IsAccessRestricted = table.Column<bool>(type: "bit", nullable: false),
                    AccessRestrictionType = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    AccessExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MaxDataSize = table.Column<int>(type: "int", nullable: true),
                    IsBillingEnabled = table.Column<bool>(type: "bit", nullable: false),
                    BillingThreshold = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    BillingFrequency = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
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
                    table.PrimaryKey("PK_FeaturePolicyConfiguration", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeaturePolicyConfiguration_PricingPlanFeature_PricingPlanFeatureId",
                        column: x => x.PricingPlanFeatureId,
                        principalSchema: "Sales",
                        principalTable: "PricingPlanFeature",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionFeature",
                schema: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubscriptionId = table.Column<int>(type: "int", nullable: false),
                    PricingPlanFeatureId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    ActivatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeactivatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    OverrideCost = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    OverrideTax = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    OverrideDiscount = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    OverrideTotal = table.Column<decimal>(type: "numeric(18,5)", precision: 18, scale: 2, nullable: true),
                    ConsumptionLimit = table.Column<int>(type: "int", nullable: true),
                    CurrentConsumption = table.Column<int>(type: "int", nullable: true),
                    ConsumptionResetDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    OverageQuantity = table.Column<int>(type: "int", nullable: true),
                    OverageCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
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
                    table.PrimaryKey("PK_SubscriptionFeature", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubscriptionFeature_PricingPlanFeature_PricingPlanFeatureId",
                        column: x => x.PricingPlanFeatureId,
                        principalSchema: "Sales",
                        principalTable: "PricingPlanFeature",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SubscriptionFeature_Subscription_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalSchema: "Sales",
                        principalTable: "Subscription",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionPlanChangeHistory",
                schema: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubscriptionId = table.Column<int>(type: "int", nullable: false),
                    OldPricingPlanId = table.Column<int>(type: "int", nullable: false),
                    NewPricingPlanId = table.Column<int>(type: "int", nullable: false),
                    ChangeDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Reason = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Notes = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    OldPlanCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    NewPlanCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    ChangeCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    IsProrated = table.Column<bool>(type: "bit", nullable: false),
                    ProcessedBy = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ProcessedByUser = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
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
                    table.PrimaryKey("PK_SubscriptionPlanChangeHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubscriptionPlanChangeHistory_Subscription_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalSchema: "Sales",
                        principalTable: "Subscription",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionRenewalHistory",
                schema: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubscriptionId = table.Column<int>(type: "int", nullable: false),
                    OldEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NewEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RenewalDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Reason = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Notes = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    RenewalCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    RenewalTax = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    RenewalDiscount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    RenewalTotal = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    ProcessedBy = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ProcessedByUser = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
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
                    table.PrimaryKey("PK_SubscriptionRenewalHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubscriptionRenewalHistory_Subscription_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalSchema: "Sales",
                        principalTable: "Subscription",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConsumptionTracking",
                schema: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubscriptionFeatureId = table.Column<int>(type: "int", nullable: false),
                    ConsumptionType = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    PackageLimit = table.Column<int>(type: "int", nullable: false),
                    CurrentUsage = table.Column<int>(type: "int", nullable: false),
                    ResetPeriod = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    LastResetDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NextResetDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AllowOverage = table.Column<bool>(type: "bit", nullable: false),
                    OverageLimit = table.Column<int>(type: "int", nullable: true),
                    OverageRate = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    OverageUsage = table.Column<int>(type: "int", nullable: false),
                    OverageCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    EntityType = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    EntityId = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    UsageDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    PricingPlanFeatureId = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_ConsumptionTracking", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConsumptionTracking_PricingPlanFeature_PricingPlanFeatureId",
                        column: x => x.PricingPlanFeatureId,
                        principalSchema: "Sales",
                        principalTable: "PricingPlanFeature",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ConsumptionTracking_SubscriptionFeature_SubscriptionFeatureId",
                        column: x => x.SubscriptionFeatureId,
                        principalSchema: "Sales",
                        principalTable: "SubscriptionFeature",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FeatureUsage",
                schema: "Sales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubscriptionFeatureId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    UsageType = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    EntityType = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    EntityId = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    DataSize = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    ProcessingTime = table.Column<int>(type: "int", nullable: true),
                    IsPolicyCompliant = table.Column<bool>(type: "bit", nullable: false),
                    PolicyViolationReason = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    IsOverage = table.Column<bool>(type: "bit", nullable: false),
                    OverageCost = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    IpAddress = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    UserAgent = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Location = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Notes = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    PricingPlanFeatureId = table.Column<int>(type: "int", nullable: true),
                    SubscriptionId = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_FeatureUsage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeatureUsage_PricingPlanFeature_PricingPlanFeatureId",
                        column: x => x.PricingPlanFeatureId,
                        principalSchema: "Sales",
                        principalTable: "PricingPlanFeature",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FeatureUsage_SubscriptionFeature_SubscriptionFeatureId",
                        column: x => x.SubscriptionFeatureId,
                        principalSchema: "Sales",
                        principalTable: "SubscriptionFeature",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FeatureUsage_Subscription_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalSchema: "Sales",
                        principalTable: "Subscription",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionPackage_CreatedAt",
                schema: "Sales",
                table: "ConsumptionPackage",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionPackage_CreatedByUserId",
                schema: "Sales",
                table: "ConsumptionPackage",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionPackage_IsActive",
                schema: "Sales",
                table: "ConsumptionPackage",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionPackage_IsDeleted",
                schema: "Sales",
                table: "ConsumptionPackage",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionPackage_Status",
                schema: "Sales",
                table: "ConsumptionPackage",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_ConsumptionPackage_Code",
                schema: "Sales",
                table: "ConsumptionPackage",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionTracking_CreatedAt",
                schema: "Sales",
                table: "ConsumptionTracking",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionTracking_CreatedByUserId",
                schema: "Sales",
                table: "ConsumptionTracking",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionTracking_IsActive",
                schema: "Sales",
                table: "ConsumptionTracking",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionTracking_IsDeleted",
                schema: "Sales",
                table: "ConsumptionTracking",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionTracking_PricingPlanFeatureId",
                schema: "Sales",
                table: "ConsumptionTracking",
                column: "PricingPlanFeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionTracking_Status",
                schema: "Sales",
                table: "ConsumptionTracking",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionTracking_SubscriptionFeatureId",
                schema: "Sales",
                table: "ConsumptionTracking",
                column: "SubscriptionFeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_Coupon_CreatedAt",
                schema: "Sales",
                table: "Coupon",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Coupon_CreatedByUserId",
                schema: "Sales",
                table: "Coupon",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Coupon_IsActive",
                schema: "Sales",
                table: "Coupon",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Coupon_IsDeleted",
                schema: "Sales",
                table: "Coupon",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Coupon_Status",
                schema: "Sales",
                table: "Coupon",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_Coupon_Code",
                schema: "Sales",
                table: "Coupon",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyConfiguration_CreatedAt",
                schema: "Sales",
                table: "FeaturePolicyConfiguration",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyConfiguration_CreatedByUserId",
                schema: "Sales",
                table: "FeaturePolicyConfiguration",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyConfiguration_Feature_Policy",
                schema: "Sales",
                table: "FeaturePolicyConfiguration",
                columns: new[] { "PricingPlanFeatureId", "PolicyTypeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyConfiguration_IsActive",
                schema: "Sales",
                table: "FeaturePolicyConfiguration",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyConfiguration_IsDeleted",
                schema: "Sales",
                table: "FeaturePolicyConfiguration",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturePolicyConfiguration_Status",
                schema: "Sales",
                table: "FeaturePolicyConfiguration",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_FeatureUsage_CreatedAt",
                schema: "Sales",
                table: "FeatureUsage",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureUsage_CreatedByUserId",
                schema: "Sales",
                table: "FeatureUsage",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureUsage_IsActive",
                schema: "Sales",
                table: "FeatureUsage",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureUsage_IsDeleted",
                schema: "Sales",
                table: "FeatureUsage",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureUsage_PricingPlanFeatureId",
                schema: "Sales",
                table: "FeatureUsage",
                column: "PricingPlanFeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureUsage_Status",
                schema: "Sales",
                table: "FeatureUsage",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_FeatureUsage_SubscriptionFeatureId",
                schema: "Sales",
                table: "FeatureUsage",
                column: "SubscriptionFeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureUsage_SubscriptionId",
                schema: "Sales",
                table: "FeatureUsage",
                column: "SubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureUsage_UserId",
                schema: "Sales",
                table: "FeatureUsage",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlan_CreatedAt",
                schema: "Sales",
                table: "PricingPlan",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlan_CreatedByUserId",
                schema: "Sales",
                table: "PricingPlan",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlan_IsActive",
                schema: "Sales",
                table: "PricingPlan",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlan_IsDeleted",
                schema: "Sales",
                table: "PricingPlan",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlan_Status",
                schema: "Sales",
                table: "PricingPlan",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_PricingPlan_Code",
                schema: "Sales",
                table: "PricingPlan",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanFeature_ConsumptionPackageId",
                schema: "Sales",
                table: "PricingPlanFeature",
                column: "ConsumptionPackageId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanFeature_CreatedAt",
                schema: "Sales",
                table: "PricingPlanFeature",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanFeature_CreatedByUserId",
                schema: "Sales",
                table: "PricingPlanFeature",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanFeature_IsActive",
                schema: "Sales",
                table: "PricingPlanFeature",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanFeature_IsDeleted",
                schema: "Sales",
                table: "PricingPlanFeature",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanFeature_PricingPlanId",
                schema: "Sales",
                table: "PricingPlanFeature",
                column: "PricingPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingPlanFeature_Status",
                schema: "Sales",
                table: "PricingPlanFeature",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Subscription_CompanyId",
                schema: "Sales",
                table: "Subscription",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscription_CreatedAt",
                schema: "Sales",
                table: "Subscription",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Subscription_CreatedByUserId",
                schema: "Sales",
                table: "Subscription",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscription_IsActive",
                schema: "Sales",
                table: "Subscription",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Subscription_IsDeleted",
                schema: "Sales",
                table: "Subscription",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_Subscription_PreviousPricingPlanId",
                schema: "Sales",
                table: "Subscription",
                column: "PreviousPricingPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscription_PricingPlanId",
                schema: "Sales",
                table: "Subscription",
                column: "PricingPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscription_Status",
                schema: "Sales",
                table: "Subscription",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionFeature_CreatedAt",
                schema: "Sales",
                table: "SubscriptionFeature",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionFeature_CreatedByUserId",
                schema: "Sales",
                table: "SubscriptionFeature",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionFeature_IsActive",
                schema: "Sales",
                table: "SubscriptionFeature",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionFeature_IsDeleted",
                schema: "Sales",
                table: "SubscriptionFeature",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionFeature_PricingPlanFeatureId",
                schema: "Sales",
                table: "SubscriptionFeature",
                column: "PricingPlanFeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionFeature_Status",
                schema: "Sales",
                table: "SubscriptionFeature",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionFeature_SubscriptionId",
                schema: "Sales",
                table: "SubscriptionFeature",
                column: "SubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionPlanChangeHistory_CreatedAt",
                schema: "Sales",
                table: "SubscriptionPlanChangeHistory",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionPlanChangeHistory_CreatedByUserId",
                schema: "Sales",
                table: "SubscriptionPlanChangeHistory",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionPlanChangeHistory_IsActive",
                schema: "Sales",
                table: "SubscriptionPlanChangeHistory",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionPlanChangeHistory_IsDeleted",
                schema: "Sales",
                table: "SubscriptionPlanChangeHistory",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionPlanChangeHistory_Status",
                schema: "Sales",
                table: "SubscriptionPlanChangeHistory",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionPlanChangeHistory_SubscriptionId",
                schema: "Sales",
                table: "SubscriptionPlanChangeHistory",
                column: "SubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionRenewalHistory_CreatedAt",
                schema: "Sales",
                table: "SubscriptionRenewalHistory",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionRenewalHistory_CreatedByUserId",
                schema: "Sales",
                table: "SubscriptionRenewalHistory",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionRenewalHistory_IsActive",
                schema: "Sales",
                table: "SubscriptionRenewalHistory",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionRenewalHistory_IsDeleted",
                schema: "Sales",
                table: "SubscriptionRenewalHistory",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionRenewalHistory_Status",
                schema: "Sales",
                table: "SubscriptionRenewalHistory",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionRenewalHistory_SubscriptionId",
                schema: "Sales",
                table: "SubscriptionRenewalHistory",
                column: "SubscriptionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConsumptionTracking",
                schema: "Sales");

            migrationBuilder.DropTable(
                name: "Coupon",
                schema: "Sales");

            migrationBuilder.DropTable(
                name: "FeaturePolicyConfiguration",
                schema: "Sales");

            migrationBuilder.DropTable(
                name: "FeatureUsage",
                schema: "Sales");

            migrationBuilder.DropTable(
                name: "SubscriptionPlanChangeHistory",
                schema: "Sales");

            migrationBuilder.DropTable(
                name: "SubscriptionRenewalHistory",
                schema: "Sales");

            migrationBuilder.DropTable(
                name: "SubscriptionFeature",
                schema: "Sales");

            migrationBuilder.DropTable(
                name: "PricingPlanFeature",
                schema: "Sales");

            migrationBuilder.DropTable(
                name: "Subscription",
                schema: "Sales");

            migrationBuilder.DropTable(
                name: "ConsumptionPackage",
                schema: "Sales");

            migrationBuilder.DropTable(
                name: "PricingPlan",
                schema: "Sales");
        }
    }
}
