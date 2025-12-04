using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ItemComposition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ItemComposition",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    ChildItemId = table.Column<int>(type: "int", nullable: false),
                    FeeId = table.Column<int>(type: "int", nullable: true),
                    TaxId = table.Column<int>(type: "int", nullable: true),
                    MeasureId = table.Column<int>(type: "int", nullable: true),
                    ExtentId = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: false),
                    Instructions = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Weight = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: true),
                    NetWeight = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: true),
                    CostPrice = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: false),
                    DiscountPercent = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: true),
                    Discount = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: true),
                    Subtotal = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: false),
                    WastePercentage = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: true),
                    IsOptional = table.Column<bool>(type: "bit", nullable: false),
                    ExtraCharge = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: true),
                    UniqueId = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    ItemCompositionId = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_ItemComposition", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemComposition_ItemComposition_ItemCompositionId",
                        column: x => x.ItemCompositionId,
                        principalSchema: "Restaurant",
                        principalTable: "ItemComposition",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ItemComposition_Item_ChildItemId",
                        column: x => x.ChildItemId,
                        principalSchema: "Restaurant",
                        principalTable: "Item",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemComposition_Item_ItemId",
                        column: x => x.ItemId,
                        principalSchema: "Restaurant",
                        principalTable: "Item",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItemComposition_ChildItemId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "ChildItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemComposition_CreatedAt",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ItemComposition_CreatedByUserId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemComposition_IsActive",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ItemComposition_IsDeleted",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ItemComposition_ItemCompositionId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "ItemCompositionId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemComposition_ItemId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemComposition_Status",
                schema: "Restaurant",
                table: "ItemComposition",
                columns: new[] { "IsActive", "IsDeleted" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemComposition",
                schema: "Restaurant");
        }
    }
}
