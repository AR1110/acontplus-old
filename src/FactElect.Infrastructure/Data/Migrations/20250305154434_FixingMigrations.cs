using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FactElect.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixingMigrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IDType",
                schema: "Customer",
                table: "Customer");

            migrationBuilder.RenameColumn(
                name: "IDCard",
                schema: "Customer",
                table: "Customer",
                newName: "IdCard");

            migrationBuilder.RenameIndex(
                name: "UXC_Customer_IDCard",
                schema: "Customer",
                table: "Customer",
                newName: "UX_Customer_IdCard");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Customer",
                table: "Customer",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValueSql: "1");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Customer",
                table: "Customer",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETDATE()");

            migrationBuilder.AddColumn<int>(
                name: "IdTypeId",
                schema: "Customer",
                table: "Customer",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdTypeId",
                schema: "Customer",
                table: "Customer");

            migrationBuilder.RenameColumn(
                name: "IdCard",
                schema: "Customer",
                table: "Customer",
                newName: "IDCard");

            migrationBuilder.RenameIndex(
                name: "UX_Customer_IdCard",
                schema: "Customer",
                table: "Customer",
                newName: "UXC_Customer_IDCard");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Customer",
                table: "Customer",
                type: "bit",
                nullable: true,
                defaultValueSql: "1",
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "Customer",
                table: "Customer",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

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
