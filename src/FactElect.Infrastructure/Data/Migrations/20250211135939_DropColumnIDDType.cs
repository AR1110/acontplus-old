using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FactElect.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class DropColumnIDDType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IDType",
                schema: "Customer",
                table: "Customer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IDType",
                schema: "Customer",
                table: "Customer",
                type: "varchar(2)",
                unicode: false,
                maxLength: 2,
                nullable: false,
                defaultValue: "");
        }
    }
}
