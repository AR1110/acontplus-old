using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Customer.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialPrd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Customer");

            migrationBuilder.CreateTable(
                name: "Customer",
                schema: "Customer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IDType = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                    IDCard = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    BusinessName = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    TradeName = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    Email = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
                    Telephone = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    Address = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
                    SriValidation = table.Column<bool>(type: "bit", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "1"),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "UXC_Customer_IDCard",
                schema: "Customer",
                table: "Customer",
                column: "IDCard",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Customer",
                schema: "Customer");
        }
    }
}
