using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class OrderDetailCompositionModifier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UniqueId",
                schema: "Restaurant",
                table: "OrderDetailModifier",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UniqueId",
                schema: "Restaurant",
                table: "OrderDetail",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "OrderDetailCompositionModifier",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderDetailId = table.Column<int>(type: "int", nullable: false),
                    ModifierCompositionId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: false),
                    ExtraCharge = table.Column<decimal>(type: "decimal(18,5)", precision: 18, scale: 2, nullable: false),
                    Instructions = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    UniqueId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
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
                    table.PrimaryKey("PK_OrderDetailCompositionModifier", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderDetailCompositionModifier_ItemComposition_ModifierCompositionId",
                        column: x => x.ModifierCompositionId,
                        principalSchema: "Restaurant",
                        principalTable: "ItemComposition",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderDetailCompositionModifier_OrderDetail_OrderDetailId",
                        column: x => x.OrderDetailId,
                        principalSchema: "Restaurant",
                        principalTable: "OrderDetail",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetailCompositionModifier_ModifierCompositionId",
                schema: "Restaurant",
                table: "OrderDetailCompositionModifier",
                column: "ModifierCompositionId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetailCompositionModifier_OrderDetailId",
                schema: "Restaurant",
                table: "OrderDetailCompositionModifier",
                column: "OrderDetailId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderDetailCompositionModifier",
                schema: "Restaurant");

            migrationBuilder.DropColumn(
                name: "UniqueId",
                schema: "Restaurant",
                table: "OrderDetailModifier");

            migrationBuilder.DropColumn(
                name: "UniqueId",
                schema: "Restaurant",
                table: "OrderDetail");
        }
    }
}
