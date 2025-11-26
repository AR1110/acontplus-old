using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechnicalSupport.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyToCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UI_TS_Serie",
                schema: "TechnicalSupport",
                table: "Serie");

            migrationBuilder.DropIndex(
                name: "UI_TS_Modelo",
                schema: "TechnicalSupport",
                table: "Modelo");

            migrationBuilder.DropIndex(
                name: "UI_TS_Category",
                schema: "TechnicalSupport",
                table: "Category");

            migrationBuilder.DropIndex(
                name: "UI_TS_Brand",
                schema: "TechnicalSupport",
                table: "Brand");

            migrationBuilder.AlterColumn<string>(
                name: "ReceiverGovernmentId",
                schema: "TechnicalSupport",
                table: "Order",
                type: "varchar(25)",
                unicode: false,
                maxLength: 25,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(300)",
                oldUnicode: false,
                oldMaxLength: 300,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                schema: "TechnicalSupport",
                table: "Category",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyId",
                schema: "TechnicalSupport",
                table: "Category");

            migrationBuilder.AlterColumn<string>(
                name: "ReceiverGovernmentId",
                schema: "TechnicalSupport",
                table: "Order",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(25)",
                oldUnicode: false,
                oldMaxLength: 25,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "UI_TS_Serie",
                schema: "TechnicalSupport",
                table: "Serie",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_TS_Modelo",
                schema: "TechnicalSupport",
                table: "Modelo",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_TS_Category",
                schema: "TechnicalSupport",
                table: "Category",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UI_TS_Brand",
                schema: "TechnicalSupport",
                table: "Brand",
                column: "Code",
                unique: true);
        }
    }
}
