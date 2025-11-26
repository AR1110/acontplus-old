using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ImproveEntitiesProductionArea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Item_ProductionArea_ProductionAreaId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderDetail_Menu_MenuId",
                schema: "Restaurant",
                table: "OrderDetail");

            migrationBuilder.DropIndex(
                name: "IX_OrderDetail_MenuId",
                schema: "Restaurant",
                table: "OrderDetail");

            migrationBuilder.DropIndex(
                name: "IX_OrderDetail_Uuid",
                schema: "Restaurant",
                table: "OrderDetail");

            migrationBuilder.DropIndex(
                name: "IX_Order_Establishment_Finished_Date",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UX_Order_Uuid' AND object_id = OBJECT_ID('Restaurant.Order'))
                    DROP INDEX [UX_Order_Uuid] ON [Restaurant].[Order]
            ");

            migrationBuilder.DropIndex(
                name: "IX_Item_ProductionAreaId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "MenuId",
                schema: "Restaurant",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "Uuid",
                schema: "Restaurant",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Tax",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "TaxPercentId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Uuid",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ProductionAreaId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.RenameColumn(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "ProductionArea",
                newName: "EstablishmentId");

            migrationBuilder.AddColumn<int>(
                name: "ParentCompositionId",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UniqueId",
                schema: "Restaurant",
                table: "ItemComposition",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ItemProductionArea",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    ProductionAreaId = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_ItemProductionArea", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemProductionArea_Item_ItemId",
                        column: x => x.ItemId,
                        principalSchema: "Restaurant",
                        principalTable: "Item",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemProductionArea_ProductionArea_ProductionAreaId",
                        column: x => x.ProductionAreaId,
                        principalSchema: "Restaurant",
                        principalTable: "ProductionArea",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PrinterSetting",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PrinterId = table.Column<int>(type: "int", nullable: false),
                    ProductionAreaId = table.Column<int>(type: "int", nullable: false),
                    Copies = table.Column<short>(type: "smallint", nullable: false),
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
                    table.PrimaryKey("PK_PrinterSetting", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrinterSetting_ProductionArea_ProductionAreaId",
                        column: x => x.ProductionAreaId,
                        principalSchema: "Restaurant",
                        principalTable: "ProductionArea",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Order_Establishment_Finished_Date",
                schema: "Restaurant",
                table: "Order",
                columns: new[] { "Finished", "CreatedAt" },
                filter: "[Finished] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_ItemComposition_ParentCompositionId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "ParentCompositionId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemProductionArea_CreatedAt",
                schema: "Restaurant",
                table: "ItemProductionArea",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ItemProductionArea_CreatedByUserId",
                schema: "Restaurant",
                table: "ItemProductionArea",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemProductionArea_IsActive",
                schema: "Restaurant",
                table: "ItemProductionArea",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ItemProductionArea_IsDeleted",
                schema: "Restaurant",
                table: "ItemProductionArea",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_ItemProductionArea_ItemId",
                schema: "Restaurant",
                table: "ItemProductionArea",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemProductionArea_ProductionAreaId",
                schema: "Restaurant",
                table: "ItemProductionArea",
                column: "ProductionAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemProductionArea_Status",
                schema: "Restaurant",
                table: "ItemProductionArea",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_PrinterSetting_CreatedAt",
                schema: "Restaurant",
                table: "PrinterSetting",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterSetting_CreatedByUserId",
                schema: "Restaurant",
                table: "PrinterSetting",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterSetting_IsActive",
                schema: "Restaurant",
                table: "PrinterSetting",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterSetting_IsDeleted",
                schema: "Restaurant",
                table: "PrinterSetting",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterSetting_ProductionAreaId",
                schema: "Restaurant",
                table: "PrinterSetting",
                column: "ProductionAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_PrinterSetting_Status",
                schema: "Restaurant",
                table: "PrinterSetting",
                columns: new[] { "IsActive", "IsDeleted" });

            migrationBuilder.AddForeignKey(
                name: "FK_ItemComposition_ItemComposition_ParentCompositionId",
                schema: "Restaurant",
                table: "ItemComposition",
                column: "ParentCompositionId",
                principalSchema: "Restaurant",
                principalTable: "ItemComposition",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemComposition_ItemComposition_ParentCompositionId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropTable(
                name: "ItemProductionArea",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "PrinterSetting",
                schema: "Restaurant");

            migrationBuilder.DropIndex(
                name: "IX_Order_Establishment_Finished_Date",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_ItemComposition_ParentCompositionId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "ParentCompositionId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.DropColumn(
                name: "UniqueId",
                schema: "Restaurant",
                table: "ItemComposition");

            migrationBuilder.RenameColumn(
                name: "EstablishmentId",
                schema: "Restaurant",
                table: "ProductionArea",
                newName: "EstablecimientoId");

            migrationBuilder.AddColumn<int>(
                name: "MenuId",
                schema: "Restaurant",
                table: "OrderDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Uuid",
                schema: "Restaurant",
                table: "OrderDetail",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Order",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "Tax",
                schema: "Restaurant",
                table: "Order",
                type: "decimal(18,5)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TaxPercentId",
                schema: "Restaurant",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Uuid",
                schema: "Restaurant",
                table: "Order",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "ProductionAreaId",
                schema: "Restaurant",
                table: "Item",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_MenuId",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "MenuId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_Uuid",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "Uuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Order_Establishment_Finished_Date",
                schema: "Restaurant",
                table: "Order",
                columns: new[] { "EstablecimientoId", "Finished", "CreatedAt" },
                filter: "[Finished] = 0");

            migrationBuilder.CreateIndex(
                name: "UX_Order_Uuid",
                schema: "Restaurant",
                table: "Order",
                column: "Uuid",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Item_ProductionAreaId",
                schema: "Restaurant",
                table: "Item",
                column: "ProductionAreaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Item_ProductionArea_ProductionAreaId",
                schema: "Restaurant",
                table: "Item",
                column: "ProductionAreaId",
                principalSchema: "Restaurant",
                principalTable: "ProductionArea",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDetail_Menu_MenuId",
                schema: "Restaurant",
                table: "OrderDetail",
                column: "MenuId",
                principalSchema: "Restaurant",
                principalTable: "Menu",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
