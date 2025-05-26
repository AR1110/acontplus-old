using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BarberShop.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class BaseColumnsRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "BarberShop",
                table: "WorkSession",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "BarberShop",
                table: "WorkSession",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "BarberShop",
                table: "WorkSession",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "BarberShop",
                table: "WorkSession",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "BarberShop",
                table: "WorkSession",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "BarberShop",
                table: "WorkSession",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "BarberShop",
                table: "WorkSession",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "BarberShop",
                table: "WorkSession",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "BarberShop",
                table: "WorkSession",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "BarberShop",
                table: "WorkSession",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                table: "TicketDocuments",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                table: "TicketDocuments",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                table: "TicketDocuments",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "TicketDocuments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "TicketDocuments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                table: "TicketDocuments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "TicketDocuments",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "TicketDocuments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "TicketDocuments",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "TicketDocuments",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "BarberShop",
                table: "Ticket",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "BarberShop",
                table: "Ticket",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "BarberShop",
                table: "Ticket",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "BarberShop",
                table: "Ticket",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "BarberShop",
                table: "Ticket",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "BarberShop",
                table: "Ticket",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "BarberShop",
                table: "Ticket",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "BarberShop",
                table: "Ticket",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "BarberShop",
                table: "Ticket",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "BarberShop",
                table: "Ticket",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "BarberShop",
                table: "Seat",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "BarberShop",
                table: "Seat",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "BarberShop",
                table: "Seat",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "BarberShop",
                table: "Seat",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "BarberShop",
                table: "Seat",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "BarberShop",
                table: "Seat",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "BarberShop",
                table: "Seat",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "BarberShop",
                table: "Seat",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "BarberShop",
                table: "Seat",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "BarberShop",
                table: "Seat",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "BarberShop",
                table: "WorkSession");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "BarberShop",
                table: "WorkSession");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "BarberShop",
                table: "WorkSession");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "BarberShop",
                table: "WorkSession");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "BarberShop",
                table: "WorkSession");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "BarberShop",
                table: "WorkSession");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "BarberShop",
                table: "WorkSession");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "TicketDocuments");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "TicketDocuments");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                table: "TicketDocuments");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "TicketDocuments");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "TicketDocuments");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "TicketDocuments");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "TicketDocuments");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "BarberShop",
                table: "TicketDetail");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "BarberShop",
                table: "TicketDetail");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "BarberShop",
                table: "TicketDetail");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "BarberShop",
                table: "TicketDetail");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "BarberShop",
                table: "TicketDetail");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "BarberShop",
                table: "TicketDetail");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "BarberShop",
                table: "TicketDetail");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "BarberShop",
                table: "Ticket");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "BarberShop",
                table: "Ticket");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "BarberShop",
                table: "Ticket");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "BarberShop",
                table: "Ticket");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "BarberShop",
                table: "Ticket");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "BarberShop",
                table: "Ticket");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "BarberShop",
                table: "Ticket");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "BarberShop",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "BarberShop",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "BarberShop",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "BarberShop",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "BarberShop",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "BarberShop",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "BarberShop",
                table: "Seat");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "BarberShop",
                table: "BarberPayment");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "BarberShop",
                table: "BarberPayment");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "BarberShop",
                table: "BarberPayment");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "BarberShop",
                table: "BarberPayment");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "BarberShop",
                table: "BarberPayment");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "BarberShop",
                table: "BarberPayment");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "BarberShop",
                table: "BarberPayment");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "BarberShop",
                table: "WorkSession",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "BarberShop",
                table: "WorkSession",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "BarberShop",
                table: "WorkSession",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                table: "TicketDocuments",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                table: "TicketDocuments",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                table: "TicketDocuments",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "BarberShop",
                table: "TicketDetail",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "BarberShop",
                table: "Ticket",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "BarberShop",
                table: "Ticket",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "BarberShop",
                table: "Ticket",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "BarberShop",
                table: "Seat",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "BarberShop",
                table: "Seat",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "BarberShop",
                table: "Seat",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "BarberShop",
                table: "BarberPayment",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
