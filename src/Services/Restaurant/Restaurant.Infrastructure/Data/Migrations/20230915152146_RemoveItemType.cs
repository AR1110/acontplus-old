using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveItemType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Item_ItemType_ItemTypeId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropIndex(
                name: "IX_Item_ItemTypeId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "ItemTypeId",
                schema: "Restaurant",
                table: "Item");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ItemTypeId",
                schema: "Restaurant",
                table: "Item",
                type: "int",
                nullable: true);

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
        }
    }
}
