namespace Billing.Application.DTOs;

public static class FacturaDtos
{
    public readonly record struct CreateFacturaDto(
        InfoFacturaCreateDto InfoFactura,
        IReadOnlyList<DetalleCreateDto> Detalles,
        IReadOnlyList<PaymentDto> FormaPago,
        IReadOnlyList<TaxDto> Impuestos,
        IReadOnlyList<InfoAdicionalDto> InfoAdicional,
        IReadOnlyList<InfoAdicionalArticuloCreateDto> InfoAdicionalArticulo,
        IReadOnlyList<CuotaDto> Cuotas
    );

    public readonly record struct UpdateFacturaDto(
        int Id,
        InfoFacturaUpdateDto InfoFactura,
        IReadOnlyList<DetalleUpdateDto> Detalles,
        IReadOnlyList<PaymentUpdateDto> FormaPago,
        IReadOnlyList<TaxDto> Impuestos,
        IReadOnlyList<InfoAdicionalUpdateDto> InfoAdicional,
        IReadOnlyList<InfoAdicionalArticuloUpdateDto> InfoAdicionalArticulo,
        IReadOnlyList<CuotaUpdateDto> Cuotas
    );

    // InfoFactura for Create matches Ventas.Factura_Insert OPENJSON mapping
    public readonly record struct InfoFacturaCreateDto(
        int IdCliente,
        int IdTiempoCredito,
        int IdPuntoEmision,
        int IdUsuario,
        DateTime FechaEmision,
        DateTime FechaVencimiento,
        decimal SubTotalSinImpuestos,
        decimal TotalDescuento,
        decimal PorcentajeDescuento,
        decimal Propina,
        decimal Recargo,
        decimal Transporte,
        decimal Total,
        string Observacion,
        string Placa,
        int IdTypeId,
        string IdCard,
        string BusinessName,
        string TradeName,
        string DireccionComprador,
        string Email,
        string Telefono,
        int? SupportId
    );

    // InfoFactura for Update matches Ventas.Factura_Update OPENJSON mapping
    public readonly record struct InfoFacturaUpdateDto(
        int IdCliente,
        int IdTiempoCredito,
        int IdPuntoEmision,
        int IdUsuario,
        DateTime FechaEmision,
        DateTime FechaVencimiento,
        decimal SubTotalSinImpuestos,
        decimal TotalDescuento,
        decimal PorcentajeDescuento,
        decimal Propina,
        decimal Recargo,
        decimal Transporte,
        decimal Total,
        string Observacion,
        string Placa
    );

    // Detalles
    public readonly record struct DetalleCreateDto(
        int OrderIndex,
        int IdArticulo,
        int IdTarifa,
        int IdBodega,
        int? IdMedida,
        int IdTipoIva,
        decimal Ice,
        decimal Cantidad,
        decimal PrecioUnitario,
        decimal PrecioCosto,
        decimal PrecioSinSubsidio,
        decimal ValorDescuento,
        decimal PorcentajeDescuento,
        string CodigoPorcentaje,
        decimal Tarifa,
        decimal ValorImpuesto,
        decimal PrecioTotalSinImpuesto,
        string Nota,
        string Descripcion,
        bool LlevaInventario,
        decimal CantidadTransaccion,
        decimal Conversion,
        decimal PrecioCostoFraccionado,
        string Uuid
    );

    public readonly record struct DetalleUpdateDto(
        int OrderIndex,
        int IdFacturaDetalle,
        int IdArticulo,
        int IdTarifa,
        int IdBodega,
        int? IdMedida,
        int IdTipoIva,
        decimal Ice,
        decimal Cantidad,
        decimal PrecioUnitario,
        decimal PrecioCosto,
        decimal ValorDescuento,
        decimal PorcentajeDescuento,
        decimal PrecioTotalSinImpuesto,
        decimal ValorImpuesto,
        string CodigoPorcentaje,
        decimal Tarifa,
        string Nota,
        string Descripcion,
        bool LlevaInventario,
        decimal CantidadTransaccion,
        decimal Conversion,
        decimal PrecioCostoFraccionado,
        bool Estado,
        string Uuid
    );

    // Forma de Pago
    public readonly record struct PaymentDto(
        int IdFormaPagoSri,
        int IdTiempoCredito,
        decimal Total
    );

    public readonly record struct PaymentUpdateDto(
        int IdFormaPagoFactura,
        int IdFormaPagoSri,
        int IdTiempoCredito,
        decimal Total
    );

    // Impuestos
    public readonly record struct TaxDto(
        int TaxId,
        int TaxPercentId,
        decimal Percent,
        decimal TaxBase,
        decimal TaxValue,
        decimal Discount
    );

    // Info Adicional
    public readonly record struct InfoAdicionalDto(
        string Nombre,
        string Valor,
        int? IdInfoAdicional
    );

    public readonly record struct InfoAdicionalUpdateDto(
        int? IdInfoAdicional,
        string Nombre,
        string Valor
    );

    // Info Adicional Articulo (historial)
    public readonly record struct InfoAdicionalArticuloCreateDto(
        int IdInfoAdicional,
        string Uuid
    );

    public readonly record struct InfoAdicionalArticuloUpdateDto(
        int IdHistoryInfoAdicional,
        int IdInfoAdicional,
        int Estado,
        string Uuid
    );

    // Cuotas
    public readonly record struct CuotaDto(
        int NroCuota,
        DateTime FechaVencimiento,
        decimal Cuota,
        bool Entrada
    );

    public readonly record struct CuotaUpdateDto(
        int IdCuotaPorCobrar,
        int NroCuota,
        DateTime FechaVencimiento,
        decimal Cuota,
        bool Entrada
    );

    // Cancel
    public readonly record struct CancelFacturaDto(
        IReadOnlyList<InfoAdicionalCancelDto> InfoAdicional
    );

    public readonly record struct InfoAdicionalCancelDto(
        string Nombre,
        string Valor
    );
}


