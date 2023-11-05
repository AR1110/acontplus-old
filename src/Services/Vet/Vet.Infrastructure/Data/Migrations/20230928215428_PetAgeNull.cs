using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vet.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class PetAgeNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Age",
                schema: "Pet",
                table: "Pet",
                type: "numeric(4,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(4,2)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Age",
                schema: "Pet",
                table: "Pet",
                type: "numeric(4,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "numeric(4,2)",
                oldNullable: true);
        }
    }
}
