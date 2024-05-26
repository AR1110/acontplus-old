using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vet.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class addingColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Breed_PetType_PetTypeId",
                schema: "Pet",
                table: "Breed");

            migrationBuilder.DropForeignKey(
                name: "FK_Pet_PetType_PetTypeId",
                schema: "Pet",
                table: "Pet");

            migrationBuilder.DropIndex(
                name: "IX_Pet_PetTypeId",
                schema: "Pet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "Age",
                schema: "Pet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "PetTypeId",
                schema: "Pet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "Weight",
                schema: "Pet",
                table: "Pet");

            migrationBuilder.AlterColumn<int>(
                name: "CustomerId",
                schema: "Pet",
                table: "Pet",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                schema: "Pet",
                table: "Pet",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CustomerCompanyId",
                schema: "Pet",
                table: "Pet",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EstablecimientoId",
                schema: "Pet",
                table: "MedicalHistory",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "PetTypeId",
                schema: "Pet",
                table: "Breed",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Breed_PetType_PetTypeId",
                schema: "Pet",
                table: "Breed",
                column: "PetTypeId",
                principalSchema: "Pet",
                principalTable: "PetType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Breed_PetType_PetTypeId",
                schema: "Pet",
                table: "Breed");

            migrationBuilder.DropColumn(
                name: "CustomerCompanyId",
                schema: "Pet",
                table: "Pet");

            migrationBuilder.DropColumn(
                name: "EstablecimientoId",
                schema: "Pet",
                table: "MedicalHistory");

            migrationBuilder.AlterColumn<int>(
                name: "CustomerId",
                schema: "Pet",
                table: "Pet",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                schema: "Pet",
                table: "Pet",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Age",
                schema: "Pet",
                table: "Pet",
                type: "numeric(4,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PetTypeId",
                schema: "Pet",
                table: "Pet",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Weight",
                schema: "Pet",
                table: "Pet",
                type: "numeric(4,2)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "PetTypeId",
                schema: "Pet",
                table: "Breed",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Pet_PetTypeId",
                schema: "Pet",
                table: "Pet",
                column: "PetTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Breed_PetType_PetTypeId",
                schema: "Pet",
                table: "Breed",
                column: "PetTypeId",
                principalSchema: "Pet",
                principalTable: "PetType",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Pet_PetType_PetTypeId",
                schema: "Pet",
                table: "Pet",
                column: "PetTypeId",
                principalSchema: "Pet",
                principalTable: "PetType",
                principalColumn: "Id");
        }
    }
}
