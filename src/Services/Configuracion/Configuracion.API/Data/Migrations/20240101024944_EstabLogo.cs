using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Configuracion.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class EstabLogo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EstablecimientoLogo",
                schema: "Config",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EstablecimientoId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ContentType = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    FileName = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    IsCompressed = table.Column<bool>(type: "bit", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstablecimientoLogo", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "UI_EstabLogo_EstablecimientoId",
                schema: "Config",
                table: "EstablecimientoLogo",
                column: "EstablecimientoId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EstablecimientoLogo",
                schema: "Config");
        }
    }
}
