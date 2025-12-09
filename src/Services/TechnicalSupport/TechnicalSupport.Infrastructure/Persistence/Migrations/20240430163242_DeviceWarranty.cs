using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TechnicalSupport.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class DeviceWarranty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Warranty",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "varchar(10)",
                unicode: false,
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldUnicode: false,
                oldMaxLength: 8);

            migrationBuilder.AddColumn<string>(
                name: "Receiver",
                schema: "TechnicalSupport",
                table: "Order",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceiverGovernmentId",
                schema: "TechnicalSupport",
                table: "Order",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "varchar(10)",
                unicode: false,
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldUnicode: false,
                oldMaxLength: 8);

            migrationBuilder.AlterColumn<string>(
                name: "SerialNumber",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "varchar(300)",
                unicode: false,
                maxLength: 300,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldUnicode: false,
                oldMaxLength: 100);

            migrationBuilder.AddColumn<DateTime>(
                name: "WarrantyEndDate",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WarrantyStartDate",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "Category",
                type: "varchar(10)",
                unicode: false,
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldUnicode: false,
                oldMaxLength: 8);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "varchar(10)",
                unicode: false,
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(8)",
                oldUnicode: false,
                oldMaxLength: 8);

            migrationBuilder.CreateTable(
                name: "WarrantyHistory",
                schema: "TechnicalSupport",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DeviceCustomerId = table.Column<int>(type: "int", nullable: false),
                    WarrantyStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WarrantyEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WarrantyHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WarrantyHistory_DeviceCustomer_DeviceCustomerId",
                        column: x => x.DeviceCustomerId,
                        principalSchema: "TechnicalSupport",
                        principalTable: "DeviceCustomer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WarrantyHistory_DeviceCustomerId",
                schema: "TechnicalSupport",
                table: "WarrantyHistory",
                column: "DeviceCustomerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WarrantyHistory",
                schema: "TechnicalSupport");

            migrationBuilder.DropColumn(
                name: "Receiver",
                schema: "TechnicalSupport",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ReceiverGovernmentId",
                schema: "TechnicalSupport",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "WarrantyEndDate",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.DropColumn(
                name: "WarrantyStartDate",
                schema: "TechnicalSupport",
                table: "DeviceCustomer");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "Serie",
                type: "varchar(8)",
                unicode: false,
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(10)",
                oldUnicode: false,
                oldMaxLength: 10);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "Modelo",
                type: "varchar(8)",
                unicode: false,
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(10)",
                oldUnicode: false,
                oldMaxLength: 10);

            migrationBuilder.AlterColumn<string>(
                name: "SerialNumber",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(300)",
                oldUnicode: false,
                oldMaxLength: 300);

            migrationBuilder.AddColumn<decimal>(
                name: "Warranty",
                schema: "TechnicalSupport",
                table: "DeviceCustomer",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "Category",
                type: "varchar(8)",
                unicode: false,
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(10)",
                oldUnicode: false,
                oldMaxLength: 10);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "TechnicalSupport",
                table: "Brand",
                type: "varchar(8)",
                unicode: false,
                maxLength: 8,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(10)",
                oldUnicode: false,
                oldMaxLength: 10);
        }
    }
}
