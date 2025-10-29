using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MealConsumptionsEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MealPlan",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EstablishmentId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    DailyMealLimit = table.Column<int>(type: "int", nullable: false),
                    MonthlyMealLimit = table.Column<int>(type: "int", nullable: false),
                    SubsidyPercentage = table.Column<decimal>(type: "decimal(5,2)", precision: 18, scale: 2, nullable: false),
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
                    table.PrimaryKey("PK_MealPlan", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MealScheduleSetting",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EstablishmentId = table.Column<int>(type: "int", nullable: false),
                    MealCode = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Description = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_MealScheduleSetting", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CompanyCustomerMealPlan",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyCustomerId = table.Column<int>(type: "int", nullable: false),
                    MealPlanId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
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
                    table.PrimaryKey("PK_CompanyCustomerMealPlan", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompanyCustomerMealPlan_MealPlan_MealPlanId",
                        column: x => x.MealPlanId,
                        principalSchema: "Restaurant",
                        principalTable: "MealPlan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DailyMenu",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EstablishmentId = table.Column<int>(type: "int", nullable: false),
                    MenuDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MealScheduleSettingId = table.Column<int>(type: "int", nullable: false),
                    MealPlanId = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: false),
                    StandardPrice = table.Column<decimal>(type: "decimal(10,2)", precision: 18, scale: 2, nullable: false),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_DailyMenu", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyMenu_MealPlan_MealPlanId",
                        column: x => x.MealPlanId,
                        principalSchema: "Restaurant",
                        principalTable: "MealPlan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DailyMenu_MealScheduleSetting_MealScheduleSettingId",
                        column: x => x.MealScheduleSettingId,
                        principalSchema: "Restaurant",
                        principalTable: "MealScheduleSetting",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MealPlanSchedule",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MealPlanId = table.Column<int>(type: "int", nullable: false),
                    MealScheduleSettingId = table.Column<int>(type: "int", nullable: false),
                    IsIncluded = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    UpdatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    DeletedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MealPlanSchedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MealPlanSchedule_MealPlan_MealPlanId",
                        column: x => x.MealPlanId,
                        principalSchema: "Restaurant",
                        principalTable: "MealPlan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MealPlanSchedule_MealScheduleSetting_MealScheduleSettingId",
                        column: x => x.MealScheduleSettingId,
                        principalSchema: "Restaurant",
                        principalTable: "MealScheduleSetting",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MonthlyMealAllowance",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyCustomerMealPlanId = table.Column<int>(type: "int", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<int>(type: "int", nullable: false),
                    AllocatedMeals = table.Column<int>(type: "int", nullable: false),
                    ConsumedMeals = table.Column<int>(type: "int", nullable: false),
                    RemainingMeals = table.Column<int>(type: "int", nullable: false),
                    TotalSubsidy = table.Column<decimal>(type: "decimal(10,2)", precision: 18, scale: 2, nullable: true),
                    CompanyCustomerContribution = table.Column<decimal>(type: "decimal(10,2)", precision: 18, scale: 2, nullable: true),
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
                    table.PrimaryKey("PK_MonthlyMealAllowance", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MonthlyMealAllowance_CompanyCustomerMealPlan_CompanyCustomerMealPlanId",
                        column: x => x.CompanyCustomerMealPlanId,
                        principalSchema: "Restaurant",
                        principalTable: "CompanyCustomerMealPlan",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MealConsumption",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MealScheduleSettingId = table.Column<int>(type: "int", nullable: false),
                    MonthlyAllowanceId = table.Column<int>(type: "int", nullable: false),
                    OrderId = table.Column<int>(type: "int", nullable: true),
                    ConsumptionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(10,2)", precision: 18, scale: 2, nullable: false),
                    SubsidyAmount = table.Column<decimal>(type: "decimal(10,2)", precision: 18, scale: 2, nullable: true),
                    CompanyCustomerPayment = table.Column<decimal>(type: "decimal(10,2)", precision: 18, scale: 2, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CancellationReason = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
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
                    table.PrimaryKey("PK_MealConsumption", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MealConsumption_MealScheduleSetting_MealScheduleSettingId",
                        column: x => x.MealScheduleSettingId,
                        principalSchema: "Restaurant",
                        principalTable: "MealScheduleSetting",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MealConsumption_MonthlyMealAllowance_MonthlyAllowanceId",
                        column: x => x.MonthlyAllowanceId,
                        principalSchema: "Restaurant",
                        principalTable: "MonthlyMealAllowance",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MealConsumption_Order_OrderId",
                        column: x => x.OrderId,
                        principalSchema: "Restaurant",
                        principalTable: "Order",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "CancelledMealConsumption",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MealConsumptionId = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
                    CancelledByUserId = table.Column<int>(type: "int", nullable: true),
                    CancelledAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IpAddress = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    UpdatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    DeletedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CancelledMealConsumption", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CancelledMealConsumption_MealConsumption_MealConsumptionId",
                        column: x => x.MealConsumptionId,
                        principalSchema: "Restaurant",
                        principalTable: "MealConsumption",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MealConsumptionAudits",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MealConsumptionId = table.Column<int>(type: "int", nullable: false),
                    Action = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Reason = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    ActionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IpAddress = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    AdditionalData = table.Column<string>(type: "varchar(4000)", unicode: false, maxLength: 4000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    UpdatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    DeletedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MealConsumptionAudits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MealConsumptionAudits_MealConsumption_MealConsumptionId",
                        column: x => x.MealConsumptionId,
                        principalSchema: "Restaurant",
                        principalTable: "MealConsumption",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CancelledMealConsumption_MealConsumptionId",
                schema: "Restaurant",
                table: "CancelledMealConsumption",
                column: "MealConsumptionId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyCustomerMealPlan_CreatedAt",
                schema: "Restaurant",
                table: "CompanyCustomerMealPlan",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyCustomerMealPlan_CreatedByUserId",
                schema: "Restaurant",
                table: "CompanyCustomerMealPlan",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyCustomerMealPlan_IsActive",
                schema: "Restaurant",
                table: "CompanyCustomerMealPlan",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyCustomerMealPlan_IsDeleted",
                schema: "Restaurant",
                table: "CompanyCustomerMealPlan",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyCustomerMealPlan_MealPlanId",
                schema: "Restaurant",
                table: "CompanyCustomerMealPlan",
                column: "MealPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyCustomerMealPlan_Status",
                schema: "Restaurant",
                table: "CompanyCustomerMealPlan",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeMealPlan_Customer_Active",
                schema: "Restaurant",
                table: "CompanyCustomerMealPlan",
                columns: new[] { "CompanyCustomerId", "IsActive" })
                .Annotation("SqlServer:Include", new[] { "MealPlanId", "StartDate", "EndDate" });

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeMealPlan_Customer_Plan_StartDate",
                schema: "Restaurant",
                table: "CompanyCustomerMealPlan",
                columns: new[] { "CompanyCustomerId", "MealPlanId", "StartDate" });

            migrationBuilder.CreateIndex(
                name: "IX_DailyMenu_CreatedAt",
                schema: "Restaurant",
                table: "DailyMenu",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_DailyMenu_CreatedByUserId",
                schema: "Restaurant",
                table: "DailyMenu",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyMenu_Establishment_Date_Schedule",
                schema: "Restaurant",
                table: "DailyMenu",
                columns: new[] { "EstablishmentId", "MenuDate", "MealScheduleSettingId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DailyMenu_IsActive",
                schema: "Restaurant",
                table: "DailyMenu",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_DailyMenu_IsDeleted",
                schema: "Restaurant",
                table: "DailyMenu",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_DailyMenu_MealPlanId",
                schema: "Restaurant",
                table: "DailyMenu",
                column: "MealPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyMenu_MealScheduleSettingId",
                schema: "Restaurant",
                table: "DailyMenu",
                column: "MealScheduleSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyMenu_Status",
                schema: "Restaurant",
                table: "DailyMenu",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_MealConsumption_Allowance_Date_Schedule",
                schema: "Restaurant",
                table: "MealConsumption",
                columns: new[] { "MonthlyAllowanceId", "ConsumptionDate", "MealScheduleSettingId" })
                .Annotation("SqlServer:Include", new[] { "Status", "Amount", "SubsidyAmount", "CompanyCustomerPayment" });

            migrationBuilder.CreateIndex(
                name: "IX_MealConsumption_CreatedAt",
                schema: "Restaurant",
                table: "MealConsumption",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MealConsumption_CreatedByUserId",
                schema: "Restaurant",
                table: "MealConsumption",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MealConsumption_Date_Schedule_Status",
                schema: "Restaurant",
                table: "MealConsumption",
                columns: new[] { "ConsumptionDate", "MealScheduleSettingId", "Status" })
                .Annotation("SqlServer:Include", new[] { "MonthlyAllowanceId" });

            migrationBuilder.CreateIndex(
                name: "IX_MealConsumption_IsActive",
                schema: "Restaurant",
                table: "MealConsumption",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_MealConsumption_IsDeleted",
                schema: "Restaurant",
                table: "MealConsumption",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MealConsumption_MealScheduleSettingId",
                schema: "Restaurant",
                table: "MealConsumption",
                column: "MealScheduleSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_MealConsumption_Order_Date",
                schema: "Restaurant",
                table: "MealConsumption",
                columns: new[] { "OrderId", "ConsumptionDate" },
                filter: "OrderId IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_MealConsumption_Status",
                schema: "Restaurant",
                table: "MealConsumption",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_MealConsumption_Status_Date",
                schema: "Restaurant",
                table: "MealConsumption",
                columns: new[] { "Status", "ConsumptionDate" })
                .Annotation("SqlServer:Include", new[] { "MonthlyAllowanceId", "Amount", "SubsidyAmount" });

            migrationBuilder.CreateIndex(
                name: "IX_MealConsumptionAudits_MealConsumptionId",
                schema: "Restaurant",
                table: "MealConsumptionAudits",
                column: "MealConsumptionId");

            migrationBuilder.CreateIndex(
                name: "IX_MealPlan_CreatedAt",
                schema: "Restaurant",
                table: "MealPlan",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MealPlan_CreatedByUserId",
                schema: "Restaurant",
                table: "MealPlan",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MealPlan_Establishment",
                schema: "Restaurant",
                table: "MealPlan",
                column: "EstablishmentId")
                .Annotation("SqlServer:Include", new[] { "Name", "DailyMealLimit", "MonthlyMealLimit", "SubsidyPercentage" });

            migrationBuilder.CreateIndex(
                name: "IX_MealPlan_Establishment_Name",
                schema: "Restaurant",
                table: "MealPlan",
                columns: new[] { "EstablishmentId", "Name" })
                .Annotation("SqlServer:Include", new[] { "DailyMealLimit", "MonthlyMealLimit", "SubsidyPercentage" });

            migrationBuilder.CreateIndex(
                name: "IX_MealPlan_IsActive",
                schema: "Restaurant",
                table: "MealPlan",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_MealPlan_IsDeleted",
                schema: "Restaurant",
                table: "MealPlan",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MealPlan_Status",
                schema: "Restaurant",
                table: "MealPlan",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_MealPlanSchedule_MealPlanId",
                schema: "Restaurant",
                table: "MealPlanSchedule",
                column: "MealPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_MealPlanSchedule_MealScheduleSettingId",
                schema: "Restaurant",
                table: "MealPlanSchedule",
                column: "MealScheduleSettingId");

            migrationBuilder.CreateIndex(
                name: "IX_MealScheduleSetting_CreatedAt",
                schema: "Restaurant",
                table: "MealScheduleSetting",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MealScheduleSetting_CreatedByUserId",
                schema: "Restaurant",
                table: "MealScheduleSetting",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MealScheduleSetting_Establishment_Code",
                schema: "Restaurant",
                table: "MealScheduleSetting",
                columns: new[] { "EstablishmentId", "MealCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MealScheduleSetting_Establishment_Order",
                schema: "Restaurant",
                table: "MealScheduleSetting",
                columns: new[] { "EstablishmentId", "DisplayOrder" })
                .Annotation("SqlServer:Include", new[] { "MealCode", "Description", "StartTime", "EndTime" });

            migrationBuilder.CreateIndex(
                name: "IX_MealScheduleSetting_IsActive",
                schema: "Restaurant",
                table: "MealScheduleSetting",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_MealScheduleSetting_IsDeleted",
                schema: "Restaurant",
                table: "MealScheduleSetting",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MealScheduleSetting_Status",
                schema: "Restaurant",
                table: "MealScheduleSetting",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_MealScheduleSetting_Time_Active",
                schema: "Restaurant",
                table: "MealScheduleSetting",
                columns: new[] { "EstablishmentId", "StartTime", "EndTime", "DisplayOrder" })
                .Annotation("SqlServer:Include", new[] { "MealCode", "Description" });

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyMealAllowance_CreatedAt",
                schema: "Restaurant",
                table: "MonthlyMealAllowance",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyMealAllowance_CreatedByUserId",
                schema: "Restaurant",
                table: "MonthlyMealAllowance",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyMealAllowance_Current",
                schema: "Restaurant",
                table: "MonthlyMealAllowance",
                columns: new[] { "Year", "Month", "CompanyCustomerMealPlanId" })
                .Annotation("SqlServer:Include", new[] { "AllocatedMeals", "ConsumedMeals", "RemainingMeals" });

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyMealAllowance_IsActive",
                schema: "Restaurant",
                table: "MonthlyMealAllowance",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyMealAllowance_IsDeleted",
                schema: "Restaurant",
                table: "MonthlyMealAllowance",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyMealAllowance_Plan_YearMonth",
                schema: "Restaurant",
                table: "MonthlyMealAllowance",
                columns: new[] { "CompanyCustomerMealPlanId", "Year", "Month" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyMealAllowance_Remaining",
                schema: "Restaurant",
                table: "MonthlyMealAllowance",
                columns: new[] { "RemainingMeals", "Year", "Month" },
                filter: "RemainingMeals > 0");

            migrationBuilder.CreateIndex(
                name: "IX_MonthlyMealAllowance_Status",
                schema: "Restaurant",
                table: "MonthlyMealAllowance",
                columns: new[] { "IsActive", "IsDeleted" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CancelledMealConsumption",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "DailyMenu",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "MealConsumptionAudits",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "MealPlanSchedule",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "MealConsumption",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "MealScheduleSetting",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "MonthlyMealAllowance",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "CompanyCustomerMealPlan",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "MealPlan",
                schema: "Restaurant");
        }
    }
}
