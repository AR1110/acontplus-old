using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRestaurantEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItemModifier",
                schema: "Restaurant");

            migrationBuilder.CreateTable(
                name: "OrderDetail",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Uuid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    MenuId = table.Column<int>(type: "int", nullable: true),
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    TaxPercentId = table.Column<int>(type: "int", nullable: true),
                    FeeId = table.Column<int>(type: "int", nullable: true),
                    TaxValue = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 5, nullable: true),
                    Quantity = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 5, nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 5, nullable: false),
                    SalePrice = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 5, nullable: false),
                    Discount = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    DiscountPercent = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: false),
                    Subtotal = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 5, nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 5, nullable: false),
                    Obs = table.Column<string>(type: "varchar(1000)", unicode: false, maxLength: 1000, nullable: true),
                    WarehouseId = table.Column<int>(type: "int", nullable: true),
                    MeasureId = table.Column<int>(type: "int", nullable: false),
                    IsPaid = table.Column<bool>(type: "bit", nullable: false),
                    RemainingQuantity = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 5, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_OrderDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderDetail_Item_ItemId",
                        column: x => x.ItemId,
                        principalSchema: "Restaurant",
                        principalTable: "Item",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderDetail_Menu_MenuId",
                        column: x => x.MenuId,
                        principalSchema: "Restaurant",
                        principalTable: "Menu",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_OrderDetail_Order_OrderId",
                        column: x => x.OrderId,
                        principalSchema: "Restaurant",
                        principalTable: "Order",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderDetailModifier",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderDetailId = table.Column<int>(type: "int", nullable: false),
                    ModifierItemId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 5, nullable: false),
                    ExtraCharge = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 5, nullable: false),
                    Action = table.Column<int>(type: "int", nullable: false),
                    Instructions = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
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
                    table.PrimaryKey("PK_OrderDetailModifier", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderDetailModifier_Item_ModifierItemId",
                        column: x => x.ModifierItemId,
                        principalSchema: "Restaurant",
                        principalTable: "Item",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderDetailModifier_OrderDetail_OrderDetailId",
                        column: x => x.OrderDetailId,
                        principalSchema: "Restaurant",
                        principalTable: "OrderDetail",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_CreatedAt",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_CreatedByUserId",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_IsActive",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_IsDeleted",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_ItemId",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_MenuId",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "MenuId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_OrderId",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_OrderId_Status",
                schema: "Restaurant",
                table: "OrderDetail",
                columns: new[] { "OrderId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_Status",
                schema: "Restaurant",
                table: "OrderDetail",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_Status_Only",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_Uuid",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "Uuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetailModifier_CreatedAt",
                schema: "Restaurant",
                table: "OrderDetailModifier",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetailModifier_CreatedByUserId",
                schema: "Restaurant",
                table: "OrderDetailModifier",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetailModifier_IsActive",
                schema: "Restaurant",
                table: "OrderDetailModifier",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetailModifier_IsDeleted",
                schema: "Restaurant",
                table: "OrderDetailModifier",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetailModifier_ModifierItemId",
                schema: "Restaurant",
                table: "OrderDetailModifier",
                column: "ModifierItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetailModifier_OrderDetailId",
                schema: "Restaurant",
                table: "OrderDetailModifier",
                column: "OrderDetailId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetailModifier_Status",
                schema: "Restaurant",
                table: "OrderDetailModifier",
                columns: new[] { "IsActive", "IsDeleted" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderDetailModifier",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "OrderDetail",
                schema: "Restaurant");

            migrationBuilder.CreateTable(
                name: "OrderItemModifier",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ModifierItemId = table.Column<int>(type: "int", nullable: false),
                    OrderItemId = table.Column<int>(type: "int", nullable: false),
                    Action = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CreatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    CreatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    DeletedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    DeletedByUserId = table.Column<int>(type: "int", nullable: true),
                    ExtraCharge = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: false, defaultValue: 0m),
                    Instructions = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsMobileRequest = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: false, defaultValue: 1m),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2(7)", precision: 7, nullable: true),
                    UpdatedBy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    UpdatedByUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItemModifier", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItemModifier_Item_ModifierItemId",
                        column: x => x.ModifierItemId,
                        principalSchema: "Restaurant",
                        principalTable: "Item",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderItemModifier_OrderItem_OrderItemId",
                        column: x => x.OrderItemId,
                        principalSchema: "Restaurant",
                        principalTable: "OrderItem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_CreatedAt",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_CreatedByUserId",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_IsActive",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_IsDeleted",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_Modifier_Action_Date",
                schema: "Restaurant",
                table: "OrderItemModifier",
                columns: new[] { "ModifierItemId", "Action", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_ModifierItemId",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "ModifierItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_OrderItemId",
                schema: "Restaurant",
                table: "OrderItemModifier",
                column: "OrderItemId")
                .Annotation("SqlServer:Include", new[] { "ModifierItemId", "Action", "ExtraCharge" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemModifier_Status",
                schema: "Restaurant",
                table: "OrderItemModifier",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "UX_OrderItemModifier_OrderItem_Modifier_Action",
                schema: "Restaurant",
                table: "OrderItemModifier",
                columns: new[] { "OrderItemId", "ModifierItemId", "Action" },
                unique: true);
        }
    }
}
