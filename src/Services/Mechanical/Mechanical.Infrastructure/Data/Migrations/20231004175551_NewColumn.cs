using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanical.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class NewColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
               name: "Percentage",
               schema: "Mechanical",
               table: "MaintenanceDetail",
               type: "numeric(18,5)",
               nullable: false,
               defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "codePercentage",
                schema: "Mechanical",
                table: "MaintenanceDetail",
                type: "varchar(10)",
                unicode: false,
                maxLength: 10,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Percentage",
                schema: "Mechanical",
                table: "MaintenanceDetail",
                type: "numeric(18,5)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "codePercentage",
                schema: "Mechanical",
                table: "MaintenanceDetail",
                type: "varchar(10)",
                unicode: false,
                maxLength: 10,
                nullable: false,
                defaultValue: "");
        }
    }
}
