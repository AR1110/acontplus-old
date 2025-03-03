using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FactElect.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddIdentificationTypeIdColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IDTypeId",
                schema: "Customer",
                table: "Customer",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IDTypeId",
                schema: "Customer",
                table: "Customer");
        }
    }
}
