using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vet.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class Initial_Vet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Vet");

            migrationBuilder.CreateTable(
                name: "Behavior",
                schema: "Vet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Behavior", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BehaviorStatus",
                schema: "Vet",
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
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BehaviorStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiseaseStatus",
                schema: "Vet",
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
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiseaseStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiseaseType",
                schema: "Vet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiseaseType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Gender",
                schema: "Vet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gender", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PetType",
                schema: "Vet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PetType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Disease",
                schema: "Vet",
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
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Disease", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Disease_DiseaseType_DiseaseTypeId",
                        column: x => x.DiseaseTypeId,
                        principalSchema: "Vet",
                        principalTable: "DiseaseType",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Breed",
                schema: "Vet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PetTypeId = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Breed", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Breed_PetType_PetTypeId",
                        column: x => x.PetTypeId,
                        principalSchema: "Vet",
                        principalTable: "PetType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pet",
                schema: "Vet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    CompanyId = table.Column<int>(type: "int", nullable: true),
                    CustomerCompanyId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "varchar(150)", unicode: false, maxLength: 150, nullable: false),
                    BreedId = table.Column<int>(type: "int", nullable: true),
                    GenderId = table.Column<int>(type: "int", nullable: true),
                    Color = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Birthdate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pet_Breed_BreedId",
                        column: x => x.BreedId,
                        principalSchema: "Vet",
                        principalTable: "Breed",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Pet_Gender_GenderId",
                        column: x => x.GenderId,
                        principalSchema: "Vet",
                        principalTable: "Gender",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MedicalHistory",
                schema: "Vet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PetId = table.Column<int>(type: "int", nullable: false),
                    Observations = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    CodEstab = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    EstablecimientoId = table.Column<int>(type: "int", nullable: true),
                    Age = table.Column<decimal>(type: "numeric(4,2)", nullable: true),
                    Weight = table.Column<decimal>(type: "numeric(4,2)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalHistory_Pet_PetId",
                        column: x => x.PetId,
                        principalSchema: "Vet",
                        principalTable: "Pet",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BehaviorTest",
                schema: "Vet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalHistoryId = table.Column<int>(type: "int", nullable: false),
                    BehaviorId = table.Column<int>(type: "int", nullable: false),
                    BehaviorStatusId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BehaviorTest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BehaviorTest_BehaviorStatus_BehaviorStatusId",
                        column: x => x.BehaviorStatusId,
                        principalSchema: "Vet",
                        principalTable: "BehaviorStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BehaviorTest_Behavior_BehaviorId",
                        column: x => x.BehaviorId,
                        principalSchema: "Vet",
                        principalTable: "Behavior",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BehaviorTest_MedicalHistory_MedicalHistoryId",
                        column: x => x.MedicalHistoryId,
                        principalSchema: "Vet",
                        principalTable: "MedicalHistory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HealthCheck",
                schema: "Vet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalHistoryId = table.Column<int>(type: "int", nullable: false),
                    DiseaseId = table.Column<int>(type: "int", nullable: false),
                    DiseaseStatusId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthCheck", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthCheck_DiseaseStatus_DiseaseStatusId",
                        column: x => x.DiseaseStatusId,
                        principalSchema: "Vet",
                        principalTable: "DiseaseStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthCheck_Disease_DiseaseId",
                        column: x => x.DiseaseId,
                        principalSchema: "Vet",
                        principalTable: "Disease",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthCheck_MedicalHistory_MedicalHistoryId",
                        column: x => x.MedicalHistoryId,
                        principalSchema: "Vet",
                        principalTable: "MedicalHistory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "UQ_Behavior_Code",
                schema: "Vet",
                table: "Behavior",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_BehaviorStatus_Code",
                schema: "Vet",
                table: "BehaviorStatus",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BehaviorTest_BehaviorId",
                schema: "Vet",
                table: "BehaviorTest",
                column: "BehaviorId");

            migrationBuilder.CreateIndex(
                name: "IX_BehaviorTest_BehaviorStatusId",
                schema: "Vet",
                table: "BehaviorTest",
                column: "BehaviorStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_BehaviorTest_MedicalHistoryId",
                schema: "Vet",
                table: "BehaviorTest",
                column: "MedicalHistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Breed_PetTypeId",
                schema: "Vet",
                table: "Breed",
                column: "PetTypeId");

            migrationBuilder.CreateIndex(
                name: "UQ_Breed_Code",
                schema: "Vet",
                table: "Breed",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Disease_DiseaseTypeId",
                schema: "Vet",
                table: "Disease",
                column: "DiseaseTypeId");

            migrationBuilder.CreateIndex(
                name: "UQ_Disease_Code",
                schema: "Vet",
                table: "Disease",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_DiseaseStatus_Code",
                schema: "Vet",
                table: "DiseaseStatus",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_DiseaseType_Code",
                schema: "Vet",
                table: "DiseaseType",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_Gender_Code",
                schema: "Vet",
                table: "Gender",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HealthCheck_DiseaseId",
                schema: "Vet",
                table: "HealthCheck",
                column: "DiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthCheck_DiseaseStatusId",
                schema: "Vet",
                table: "HealthCheck",
                column: "DiseaseStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthCheck_MedicalHistoryId",
                schema: "Vet",
                table: "HealthCheck",
                column: "MedicalHistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalHistory_PetId",
                schema: "Vet",
                table: "MedicalHistory",
                column: "PetId");

            migrationBuilder.CreateIndex(
                name: "IX_Pet_BreedId",
                schema: "Vet",
                table: "Pet",
                column: "BreedId");

            migrationBuilder.CreateIndex(
                name: "IX_Pet_GenderId",
                schema: "Vet",
                table: "Pet",
                column: "GenderId");

            migrationBuilder.CreateIndex(
                name: "UQ_PetType_Code",
                schema: "Vet",
                table: "PetType",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BehaviorTest",
                schema: "Vet");

            migrationBuilder.DropTable(
                name: "HealthCheck",
                schema: "Vet");

            migrationBuilder.DropTable(
                name: "BehaviorStatus",
                schema: "Vet");

            migrationBuilder.DropTable(
                name: "Behavior",
                schema: "Vet");

            migrationBuilder.DropTable(
                name: "DiseaseStatus",
                schema: "Vet");

            migrationBuilder.DropTable(
                name: "Disease",
                schema: "Vet");

            migrationBuilder.DropTable(
                name: "MedicalHistory",
                schema: "Vet");

            migrationBuilder.DropTable(
                name: "DiseaseType",
                schema: "Vet");

            migrationBuilder.DropTable(
                name: "Pet",
                schema: "Vet");

            migrationBuilder.DropTable(
                name: "Breed",
                schema: "Vet");

            migrationBuilder.DropTable(
                name: "Gender",
                schema: "Vet");

            migrationBuilder.DropTable(
                name: "PetType",
                schema: "Vet");
        }
    }
}
