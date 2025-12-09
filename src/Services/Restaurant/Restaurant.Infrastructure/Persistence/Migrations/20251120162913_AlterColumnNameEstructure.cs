using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Restaurant.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AlterColumnNameEstructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Order_Establishment_Finished_Date",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_TableId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.RenameColumn(
                name: "Finished",
                schema: "Restaurant",
                table: "Order",
                newName: "IsFinished");

            migrationBuilder.RenameColumn(
                name: "Divided",
                schema: "Restaurant",
                table: "Order",
                newName: "IsDivided");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicableDays",
                schema: "Restaurant",
                table: "Promotion",
                type: "varchar(max)",
                unicode: false,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Order_Establishment_IsFinished_Date",
                schema: "Restaurant",
                table: "Order",
                columns: new[] { "IsFinished", "CreatedAt" },
                filter: "[IsFinished] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Order_TableId",
                schema: "Restaurant",
                table: "Order",
                column: "TableId",
                filter: "[TableId] IS NOT NULL AND [IsFinished] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Order_Establishment_IsFinished_Date",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Order_TableId",
                schema: "Restaurant",
                table: "Order");

            migrationBuilder.RenameColumn(
                name: "IsFinished",
                schema: "Restaurant",
                table: "Order",
                newName: "Finished");

            migrationBuilder.RenameColumn(
                name: "IsDivided",
                schema: "Restaurant",
                table: "Order",
                newName: "Divided");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicableDays",
                schema: "Restaurant",
                table: "Promotion",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(max)",
                oldUnicode: false,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Order_Establishment_Finished_Date",
                schema: "Restaurant",
                table: "Order",
                columns: new[] { "Finished", "CreatedAt" },
                filter: "[Finished] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Order_TableId",
                schema: "Restaurant",
                table: "Order",
                column: "TableId",
                filter: "[TableId] IS NOT NULL AND [Finished] = 0");
        }
    }
}
