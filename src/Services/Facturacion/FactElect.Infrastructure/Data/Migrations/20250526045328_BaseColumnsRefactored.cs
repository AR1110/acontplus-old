using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FactElect.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class BaseColumnsRefactored : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "TipoPago",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "TipoPago",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "TipoPago",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "TipoPago",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "TipoPago",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "TipoPago",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "TipoPago",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "TipoPago",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "TipoPago",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "TipoPago",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "TipoComprobante",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "TipoComprobante",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "TipoComprobante",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "TipoComprobante",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "TipoComprobante",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "TipoComprobante",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "TipoComprobante",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "TipoComprobante",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "TipoComprobante",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "TipoComprobante",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "SustentoTributario",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "SustentoTributario",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "SustentoTributario",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "SustentoTributario",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "SustentoTributario",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "SustentoTributario",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "SustentoTributario",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "SustentoTributario",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "SustentoTributario",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "SustentoTributario",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "Pais",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "Pais",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "Pais",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "Pais",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "Pais",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "Pais",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "Pais",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "Pais",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "Pais",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "Pais",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "FormaPago",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "FormaPago",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "FormaPago",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "FormaPago",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "FormaPago",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "FormaPago",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "FormaPago",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "FormaPago",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "FormaPago",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "FormaPago",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Customer",
                table: "Customer",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Customer",
                table: "Customer",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Customer",
                table: "Customer",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Customer",
                table: "Customer",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Customer",
                table: "Customer",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Customer",
                table: "Customer",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Customer",
                table: "Customer",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Customer",
                table: "Customer",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Customer",
                table: "Customer",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Customer",
                table: "Customer",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true,
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "TipoPago");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "TipoPago");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "TipoPago");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "TipoPago");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "TipoPago");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "TipoPago");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "TipoPago");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "TipoIdentificacionProveedor");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "TipoIdentificacionProveedor");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "TipoIdentificacionProveedor");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "TipoIdentificacionProveedor");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "TipoIdentificacionProveedor");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "TipoIdentificacionProveedor");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "TipoIdentificacionProveedor");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "TipoComprobante");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "TipoComprobante");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "TipoComprobante");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "TipoComprobante");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "TipoComprobante");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "TipoComprobante");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "TipoComprobante");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "SustentoTributario");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "SustentoTributario");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "SustentoTributario");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "SustentoTributario");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "SustentoTributario");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "SustentoTributario");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "SustentoTributario");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionIva");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "PorcentajeRetencionIva");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionIva");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "PorcentajeRetencionIva");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "PorcentajeRetencionIva");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "PorcentajeRetencionIva");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionIva");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionAir");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "PorcentajeRetencionAir");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionAir");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "PorcentajeRetencionAir");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "PorcentajeRetencionAir");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "PorcentajeRetencionAir");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "PorcentajeRetencionAir");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "ParaisoFiscal");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "ParaisoFiscal");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "ParaisoFiscal");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "ParaisoFiscal");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "ParaisoFiscal");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "ParaisoFiscal");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "ParaisoFiscal");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "Pais");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "Pais");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "Pais");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "Pais");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "Pais");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "Pais");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "Pais");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "ImpuestoRetencion");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "ImpuestoRetencion");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "ImpuestoRetencion");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "ImpuestoRetencion");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "ImpuestoRetencion");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "ImpuestoRetencion");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "ImpuestoRetencion");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "FormaPago");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "FormaPago");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "FormaPago");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "FormaPago");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "FormaPago");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "FormaPago");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "FormaPago");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "DocumentoSustentoTributario");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "DocumentoSustentoTributario");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "DocumentoSustentoTributario");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "DocumentoSustentoTributario");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "DocumentoSustentoTributario");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "DocumentoSustentoTributario");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "DocumentoSustentoTributario");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Customer",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Customer",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Customer",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Customer",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Customer",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Customer",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Customer",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                schema: "Sri",
                table: "ConceptoRetencionAir");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                schema: "Sri",
                table: "ConceptoRetencionAir");

            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "Sri",
                table: "ConceptoRetencionAir");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "Sri",
                table: "ConceptoRetencionAir");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Sri",
                table: "ConceptoRetencionAir");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                schema: "Sri",
                table: "ConceptoRetencionAir");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                schema: "Sri",
                table: "ConceptoRetencionAir");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "TipoRegimenFiscalExterior",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "TipoPago",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "TipoPago",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "TipoPago",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "TipoIdentificacionProveedor",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "TipoComprobante",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "TipoComprobante",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "TipoComprobante",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "SustentoTributario",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "SustentoTributario",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "SustentoTributario",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "PorcentajeRetencionIva",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "PorcentajeRetencionAir",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "ParaisoFiscal",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "Pais",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "Pais",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "Pais",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "ImpuestoRetencion",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "FormaPago",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "FormaPago",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "FormaPago",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "DocumentoSustentoTributario",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Customer",
                table: "Customer",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Customer",
                table: "Customer",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Customer",
                table: "Customer",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "FromMobile",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "Enabled",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "bit",
                nullable: true,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Deleted",
                schema: "Sri",
                table: "ConceptoRetencionAir",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");
        }
    }
}
