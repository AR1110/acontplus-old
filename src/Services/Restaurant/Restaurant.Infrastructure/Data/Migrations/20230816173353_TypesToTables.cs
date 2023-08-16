using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class TypesToTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderKitchen_Table_TableId",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropIndex(
                name: "IX_OrderKitchen_TableId",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.DropColumn(
                name: "TableId",
                schema: "Restaurant",
                table: "OrderKitchen");

            migrationBuilder.RenameColumn(
                name: "TypeId",
                schema: "Restaurant",
                table: "Menu",
                newName: "MenuTypeId");

            migrationBuilder.AddColumn<int>(
                name: "AppTableId",
                schema: "Restaurant",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TableId",
                schema: "Restaurant",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "IngredientType",
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
                    table.PrimaryKey("PK_IngredientType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MenuType",
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
                    table.PrimaryKey("PK_MenuType", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Order_AppTableId",
                schema: "Restaurant",
                table: "Order",
                column: "AppTableId");

            migrationBuilder.CreateIndex(
                name: "IX_Menu_MenuTypeId",
                schema: "Restaurant",
                table: "Menu",
                column: "MenuTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Menu_MenuType_MenuTypeId",
                schema: "Restaurant",
                table: "Menu",
                column: "MenuTypeId",
                principalSchema: "Restaurant",
                principalTable: "MenuType",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Table_AppTableId",
                schema: "Restaurant",
                table: "Order",
                column: "AppTableId",
                principalSchema: "Restaurant",
                principalTable: "Table",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Menu_MenuType_MenuTypeId",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropForeignKey(
                name: "FK_Order_Table_AppTableId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropTable(
                name: "IngredientType",
                schema: "Restaurant");

            migrationBuilder.DropTable(
                name: "MenuType",
                schema: "Restaurant");

            migrationBuilder.DropIndex(
                name: "IX_Order_AppTableId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Menu_MenuTypeId",
                schema: "Restaurant",
                table: "Menu");

            migrationBuilder.DropColumn(
                name: "AppTableId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "TableId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.RenameColumn(
                name: "MenuTypeId",
                schema: "Restaurant",
                table: "Menu",
                newName: "TypeId");

            migrationBuilder.AddColumn<int>(
                name: "TableId",
                schema: "Restaurant",
                table: "OrderKitchen",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_OrderKitchen_TableId",
                schema: "Restaurant",
                table: "OrderKitchen",
                column: "TableId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderKitchen_Table_TableId",
                schema: "Restaurant",
                table: "OrderKitchen",
                column: "TableId",
                principalSchema: "Restaurant",
                principalTable: "Table",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
