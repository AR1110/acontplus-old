using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vet.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialPrd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Pet");

            migrationBuilder.CreateTable(
                name: "Behavior",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Behavior", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BehaviorStatus",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Order = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BehaviorStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiseaseStatus",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Order = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiseaseStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiseaseType",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiseaseType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Gender",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gender", x => x.Id);
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
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Disease",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DiseaseTypeId = table.Column<int>(type: "int", nullable: true),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Disease", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Disease_DiseaseType_DiseaseTypeId",
                        column: x => x.DiseaseTypeId,
                        principalSchema: "Pet",
                        principalTable: "DiseaseType",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Breed",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PetTypeId = table.Column<int>(type: "int", nullable: true),
                    Code = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Breed", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Breed_PetType_PetTypeId",
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
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    PetTypeId = table.Column<int>(type: "int", nullable: true),
                    BreedId = table.Column<int>(type: "int", nullable: true),
                    GenderId = table.Column<int>(type: "int", nullable: true),
                    Age = table.Column<double>(type: "float", nullable: false),
                    Color = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Birthdate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pet_Breed_BreedId",
                        column: x => x.BreedId,
                        principalSchema: "Pet",
                        principalTable: "Breed",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Pet_Gender_GenderId",
                        column: x => x.GenderId,
                        principalSchema: "Pet",
                        principalTable: "Gender",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Pet_PetType_PetTypeId",
                        column: x => x.PetTypeId,
                        principalSchema: "Pet",
                        principalTable: "PetType",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MedicalHistory",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PetId = table.Column<int>(type: "int", nullable: false),
                    Observations = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalHistory_Pet_PetId",
                        column: x => x.PetId,
                        principalSchema: "Pet",
                        principalTable: "Pet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BehaviorTest",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalHistoryId = table.Column<int>(type: "int", nullable: false),
                    BehaviorId = table.Column<int>(type: "int", nullable: false),
                    BehaviorStatusId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BehaviorTest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BehaviorTest_BehaviorStatus_BehaviorStatusId",
                        column: x => x.BehaviorStatusId,
                        principalSchema: "Pet",
                        principalTable: "BehaviorStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BehaviorTest_Behavior_BehaviorId",
                        column: x => x.BehaviorId,
                        principalSchema: "Pet",
                        principalTable: "Behavior",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BehaviorTest_MedicalHistory_MedicalHistoryId",
                        column: x => x.MedicalHistoryId,
                        principalSchema: "Pet",
                        principalTable: "MedicalHistory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HealthCheck",
                schema: "Pet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalHistoryId = table.Column<int>(type: "int", nullable: false),
                    DiseaseId = table.Column<int>(type: "int", nullable: false),
                    DiseaseStatusId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthCheck", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthCheck_DiseaseStatus_DiseaseStatusId",
                        column: x => x.DiseaseStatusId,
                        principalSchema: "Pet",
                        principalTable: "DiseaseStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthCheck_Disease_DiseaseId",
                        column: x => x.DiseaseId,
                        principalSchema: "Pet",
                        principalTable: "Disease",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthCheck_MedicalHistory_MedicalHistoryId",
                        column: x => x.MedicalHistoryId,
                        principalSchema: "Pet",
                        principalTable: "MedicalHistory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BehaviorTest_BehaviorId",
                schema: "Pet",
                table: "BehaviorTest",
                column: "BehaviorId");

            migrationBuilder.CreateIndex(
                name: "IX_BehaviorTest_BehaviorStatusId",
                schema: "Pet",
                table: "BehaviorTest",
                column: "BehaviorStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_BehaviorTest_MedicalHistoryId",
                schema: "Pet",
                table: "BehaviorTest",
                column: "MedicalHistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Breed_PetTypeId",
                schema: "Pet",
                table: "Breed",
                column: "PetTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Disease_DiseaseTypeId",
                schema: "Pet",
                table: "Disease",
                column: "DiseaseTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthCheck_DiseaseId",
                schema: "Pet",
                table: "HealthCheck",
                column: "DiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthCheck_DiseaseStatusId",
                schema: "Pet",
                table: "HealthCheck",
                column: "DiseaseStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthCheck_MedicalHistoryId",
                schema: "Pet",
                table: "HealthCheck",
                column: "MedicalHistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalHistory_PetId",
                schema: "Pet",
                table: "MedicalHistory",
                column: "PetId");

            migrationBuilder.CreateIndex(
                name: "IX_Pet_BreedId",
                schema: "Pet",
                table: "Pet",
                column: "BreedId");

            migrationBuilder.CreateIndex(
                name: "IX_Pet_GenderId",
                schema: "Pet",
                table: "Pet",
                column: "GenderId");

            migrationBuilder.CreateIndex(
                name: "IX_Pet_PetTypeId",
                schema: "Pet",
                table: "Pet",
                column: "PetTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BehaviorTest",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "HealthCheck",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "BehaviorStatus",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "Behavior",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "DiseaseStatus",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "Disease",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "MedicalHistory",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "DiseaseType",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "Pet",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "Breed",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "Gender",
                schema: "Pet");

            migrationBuilder.DropTable(
                name: "PetType",
                schema: "Pet");
        }
    }
}
