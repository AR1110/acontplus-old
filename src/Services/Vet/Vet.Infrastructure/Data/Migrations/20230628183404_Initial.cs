using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vet.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Pet");

            migrationBuilder.CreateTable(
                name: "PetSex",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    Deleted = table.Column<int>(type: "int", nullable: true),
                    UniqueId = table.Column<string>(type: "varchar(36)", unicode: false, maxLength: 36, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetSex", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PetType",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    Deleted = table.Column<int>(type: "int", nullable: true),
                    UniqueId = table.Column<string>(type: "varchar(36)", unicode: false, maxLength: 36, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PetBreed",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PetTypeId = table.Column<int>(type: "int", nullable: true),
                    Code = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    Deleted = table.Column<int>(type: "int", nullable: true),
                    UniqueId = table.Column<string>(type: "varchar(36)", unicode: false, maxLength: 36, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetBreed", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PetBreed_PetType_PetTypeId",
                        column: x => x.PetTypeId,
                        principalSchema: "Pet",
                        principalTable: "PetType",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Pet",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientUniqueId = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: false),
                    CompanyUniqueId = table.Column<string>(type: "varchar(25)", unicode: false, maxLength: 25, nullable: false),
                    Name = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    PetTypeId = table.Column<int>(type: "int", nullable: true),
                    PetBreedId = table.Column<int>(type: "int", nullable: true),
                    PetSexId = table.Column<int>(type: "int", nullable: true),
                    Color = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Birthdate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Deleted = table.Column<int>(type: "int", nullable: true),
                    UniqueId = table.Column<string>(type: "varchar(36)", unicode: false, maxLength: 36, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pet_PetBreed_PetBreedId",
                        column: x => x.PetBreedId,
                        principalSchema: "Pet",
                        principalTable: "PetBreed",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Pet_PetSex_PetSexId",
                        column: x => x.PetSexId,
                        principalSchema: "Pet",
                        principalTable: "PetSex",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Pet_PetType_PetTypeId",
                        column: x => x.PetTypeId,
                        principalSchema: "Pet",
                        principalTable: "PetType",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pet_PetBreedId",
                schema: "Pet",
                table: "Pet",
                column: "PetBreedId");

            migrationBuilder.CreateIndex(
                name: "IX_Pet_PetSexId",
                schema: "Pet",
                table: "Pet",
                column: "PetSexId");

            migrationBuilder.CreateIndex(
                name: "IX_Pet_PetTypeId",
                schema: "Pet",
                table: "Pet",
                column: "PetTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PetBreed_PetTypeId",
                schema: "Pet",
                table: "PetBreed",
                column: "PetTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Pet",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "PetBreed",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "PetSex",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "PetType",
                schema: "Pet");
        }
    }
}
