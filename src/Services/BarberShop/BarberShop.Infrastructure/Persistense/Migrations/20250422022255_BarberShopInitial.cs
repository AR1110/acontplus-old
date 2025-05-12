using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BarberShop.Infrastructure.Persistense.Migrations
{
    /// <inheritdoc />
    public partial class BarberShopInitial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "BarberShop");

            migrationBuilder.CreateTable(
                name: "Seat",
                schema: "BarberShop",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SeatNumber = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    IsOccupied = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seat", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WorkSession",
                schema: "BarberShop",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PuntoEmisionId = table.Column<int>(type: "int", nullable: false),
                    UserBarberId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TotalSales = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    TotalAdvances = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkSession", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BarberPayment",
                schema: "BarberShop",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FormaPagoId = table.Column<int>(type: "int", nullable: false),
                    S3ObjectKey = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    S3ObjectUrl = table.Column<string>(type: "varchar(800)", unicode: false, maxLength: 800, nullable: true),
                    Comments = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    BalanceForward = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WorkSessionId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BarberPayment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BarberPayment_WorkSession_WorkSessionId",
                        column: x => x.WorkSessionId,
                        principalSchema: "BarberShop",
                        principalTable: "WorkSession",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Ticket",
                schema: "BarberShop",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PuntoEmisionId = table.Column<int>(type: "int", nullable: false),
                    Sequence = table.Column<int>(type: "int", nullable: false),
                    Serie = table.Column<string>(type: "varchar(18)", unicode: false, maxLength: 18, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Obs = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    SubTotal = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    Discount = table.Column<decimal>(type: "numeric(18,5)", nullable: true),
                    Total = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    BirthdayDiscount = table.Column<bool>(type: "bit", nullable: true),
                    LoyaltyDiscount = table.Column<bool>(type: "bit", nullable: true),
                    SeatId = table.Column<int>(type: "int", nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    WorkSessionId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ticket", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ticket_Seat_SeatId",
                        column: x => x.SeatId,
                        principalSchema: "BarberShop",
                        principalTable: "Seat",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Ticket_WorkSession_WorkSessionId",
                        column: x => x.WorkSessionId,
                        principalSchema: "BarberShop",
                        principalTable: "WorkSession",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TicketDetail",
                schema: "BarberShop",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TicketId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: true),
                    LineNumber = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    Quantity = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    Discount = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    TaxRate = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    TaxAmount = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    SubTotal = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    Total = table.Column<decimal>(type: "numeric(18,5)", nullable: false),
                    Obs = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TicketDetail_Ticket_TicketId",
                        column: x => x.TicketId,
                        principalSchema: "BarberShop",
                        principalTable: "Ticket",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TicketDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TicketId = table.Column<int>(type: "int", nullable: false),
                    DocumentoId = table.Column<int>(type: "int", nullable: true),
                    TipoDocumentoId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true, defaultValue: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    FromMobile = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TicketDocuments_Ticket_TicketId",
                        column: x => x.TicketId,
                        principalSchema: "BarberShop",
                        principalTable: "Ticket",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BarberPayment_WorkSessionId",
                schema: "BarberShop",
                table: "BarberPayment",
                column: "WorkSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Seat_Code",
                schema: "BarberShop",
                table: "Seat",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_SeatId",
                schema: "BarberShop",
                table: "Ticket",
                column: "SeatId");

            migrationBuilder.CreateIndex(
                name: "IX_Ticket_WorkSessionId",
                schema: "BarberShop",
                table: "Ticket",
                column: "WorkSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketDetail_TicketId",
                schema: "BarberShop",
                table: "TicketDetail",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketDocuments_TicketId",
                table: "TicketDocuments",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkSession_StartDate",
                schema: "BarberShop",
                table: "WorkSession",
                column: "StartDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BarberPayment",
                schema: "BarberShop");

            migrationBuilder.DropTable(
                name: "TicketDetail",
                schema: "BarberShop");

            migrationBuilder.DropTable(
                name: "TicketDocuments");

            migrationBuilder.DropTable(
                name: "Ticket",
                schema: "BarberShop");

            migrationBuilder.DropTable(
                name: "Seat",
                schema: "BarberShop");

            migrationBuilder.DropTable(
                name: "WorkSession",
                schema: "BarberShop");
        }
    }
}
