using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ItemType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_Item_ItemId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.AlterColumn<int>(
                name: "ItemId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MenuId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ItemTypeId",
                schema: "Restaurant",
                table: "Item",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ItemType",
                schema: "Restaurant",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemType", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "ItemTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_MenuId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "MenuId");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemTypeId",
                schema: "Restaurant",
                table: "Item",
                column: "ItemTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Item_ItemType_ItemTypeId",
                schema: "Restaurant",
                table: "Item",
                column: "ItemTypeId",
                principalSchema: "Restaurant",
                principalTable: "ItemType",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_ItemType_ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "ItemTypeId",
                principalSchema: "Restaurant",
                principalTable: "ItemType",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_Item_ItemId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "ItemId",
                principalSchema: "Restaurant",
                principalTable: "Item",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_Menu_MenuId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "MenuId",
                principalSchema: "Restaurant",
                principalTable: "Menu",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Item_ItemType_ItemTypeId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_ItemType_ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_Item_ItemId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_Menu_MenuId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropTable(
                name: "ItemType",
                schema: "Restaurant");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_MenuId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropIndex(
                name: "IX_Item_ItemTypeId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "ItemTypeId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "MenuId",
                schema: "Restaurant",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "Total",
                schema: "Restaurant",
                table: "MenuItem");

            migrationBuilder.DropColumn(
                name: "EndDate",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "StartDate",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "ItemTypeId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.AlterColumn<int>(
                name: "ItemId",
                schema: "Restaurant",
                table: "OrderItem",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_Item_ItemId",
                schema: "Restaurant",
                table: "OrderItem",
                column: "ItemId",
                principalSchema: "Restaurant",
                principalTable: "Item",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
