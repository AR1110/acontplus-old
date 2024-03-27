using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAccessAuthorization02 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreateAt",
                schema: "Seguridad",
                table: "AccessAuthorization",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Enabled",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                schema: "Seguridad",
                table: "AccessAuthorization",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "Enabled",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "Seguridad",
                table: "AccessAuthorization");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                schema: "Seguridad",
                table: "AccessAuthorization",
                newName: "CreateAt");
        }
    }
}
