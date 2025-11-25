using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class EstabIdColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Item_ProductionArea_ProductionAreaId",
                schema: "Restaurant",
                table: "Item");

            //migrationBuilder.DropIndex(
            //    name: "UI_ProductionArea",
            //    schema: "Restaurant",
            //    table: "ProductionArea");

            migrationBuilder.DropIndex(
                name: "IX_Item_ProductionAreaId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "ProductionAreaId",
                schema: "Restaurant",
                table: "Item");

            migrationBuilder.AddColumn<int>(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Promotion",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "ProductionArea",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Floor",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Promotion");

            migrationBuilder.DropColumn(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "ProductionArea");

            migrationBuilder.DropColumn(
                name: "EstablecimientoId",
                schema: "Restaurant",
                table: "Floor");

            migrationBuilder.AddColumn<int>(
                name: "ProductionAreaId",
                schema: "Restaurant",
                table: "Item",
                type: "int",
                nullable: true);

            //migrationBuilder.CreateIndex(
            //    name: "UI_ProductionArea",
            //    schema: "Restaurant",
            //    table: "ProductionArea",
            //    column: "Code",
            //    unique: true);

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
                principalColumn: "Id");
        }
    }
}
