using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mechanical.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class FromMobileColumnMechanical : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehicleType",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehiclePartType",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehiclePart",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehicleCompany",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Vehicle",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportStatus",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportDocument",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportDetail",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Support",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Inspection",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehicleType");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehiclePartType");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehiclePart");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Mechanical",
                table: "VehicleCompany");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Vehicle");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportStatus");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportDocument");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Mechanical",
                table: "SupportDetail");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Support");

            migrationBuilder.DropColumn(
                name: "FromMobile",
                schema: "Mechanical",
                table: "Inspection");
        }
    }
}
