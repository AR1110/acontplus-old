using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovingRowVersionColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "WhatsAppSenderConfig");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "WhatsAppMessage");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "Status");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "Priority");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "NotificationType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "MaritalStatus");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "HousingType");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Config",
                table: "EmailSenderConfig");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "EmailQueue");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Common",
                table: "Attachment");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "WhatsAppSenderConfig",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "WhatsAppMessage",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "Status",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "Priority",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "NotificationType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "Notification",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "MaritalStatus",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "HousingType",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Config",
                table: "EmailSenderConfig",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "EmailQueue",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Common",
                table: "Attachment",
                type: "rowversion",
                rowVersion: true,
                nullable: true);
        }
    }
}
