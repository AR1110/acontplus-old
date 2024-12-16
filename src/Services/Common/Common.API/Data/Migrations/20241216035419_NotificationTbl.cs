using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Common.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class NotificationTbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "UI_MaritalStatus_Code",
                schema: "Common",
                table: "MaritalStatus",
                newName: "UX_MaritalStatus_Code");

            migrationBuilder.RenameIndex(
                name: "UI_HousingType_Code",
                schema: "Common",
                table: "HousingType",
                newName: "UX_HousingType_Code");

            migrationBuilder.CreateTable(
                name: "Notification",
                schema: "Common",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompressedParameters = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    CompressedContent = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    RecipientEmail = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Status = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    DispatchedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ErrorMessage = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notification",
                schema: "Common");

            migrationBuilder.RenameIndex(
                name: "UX_MaritalStatus_Code",
                schema: "Common",
                table: "MaritalStatus",
                newName: "UI_MaritalStatus_Code");

            migrationBuilder.RenameIndex(
                name: "UX_HousingType_Code",
                schema: "Common",
                table: "HousingType",
                newName: "UI_HousingType_Code");
        }
    }
}
