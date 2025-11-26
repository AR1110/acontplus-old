namespace Billing.Application.Dtos;

public static class NotaCreditoDtos
{
    public readonly record struct CreateNotaCreditoDto(
        InfoNotaCreditoCreateDto InfoNotaCredito,
        IReadOnlyList<DetalleCreateDto> Detalles,
        IReadOnlyList<TaxDto> Impuestos,
        IReadOnlyList<InfoAdicionalDto> InfoAdicional
    );

    public readonly record struct UpdateNotaCreditoDto(
        int Id,
        InfoNotaCreditoUpdateDto InfoNotaCredito,
        IReadOnlyList<DetalleUpdateDto> Detalles,
        IReadOnlyList<TaxDto> Impuestos,
        IReadOnlyList<InfoAdicionalDto> InfoAdicional
    );

    // InfoNotaCredito for Create matches Ventas.NotaCredito_Insert OPENJSON mapping
    public readonly record struct InfoNotaCreditoCreateDto(
        int IdCliente,
        int IdFactura,
        int IdPuntoEmision,
        int IdUsuario,
        DateTime FechaEmision,
        decimal SubTotalSinImpuestos,
        decimal TotalDescuento,
        decimal PorcentajeDescuento,
        decimal Propina,
        decimal Recargo,
        decimal Transporte,
        decimal Total,
        string Observacion
    );

    // InfoNotaCredito for Update matches Ventas.NotaCredito_Update OPENJSON mapping
    public readonly record struct InfoNotaCreditoUpdateDto(
        int IdCliente,
        int IdFactura,
        DateTime FechaEmision,
        decimal SubTotalSinImpuestos,
        decimal TotalDescuento,
        decimal PorcentajeDescuento,
        decimal Propina,
        decimal Total,
        string Observacion
    );

    // Detalles Create matches Ventas.NotaCredito_Insert OPENJSON mapping
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
        decimal ValorDescuento,
        decimal PorcentajeDescuento,
        decimal PrecioTotalSinImpuesto,
        string CodigoPorcentaje,
        decimal Tarifa,
        decimal ValorImpuesto,
        string Nota,
        string Descripcion,
        bool LlevaInventario,
        decimal CantidadTransaccion,
        decimal Conversion,
        decimal PrecioCostoFraccionado
    );

    // Detalles Update matches Ventas.NotaCredito_Update OPENJSON mapping
    public readonly record struct DetalleUpdateDto(
        int OrderIndex,
        int IdNotaCreditoDetalle,
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
        string CodigoPorcentaje,
        decimal Tarifa,
        decimal ValorImpuesto,
        string Nota,
        string Descripcion,
        bool LlevaInventario,
        decimal CantidadTransaccion,
        bool Estado,
        decimal Conversion,
        decimal PrecioCostoFraccionado
    );

    public readonly record struct TaxDto(
        int TaxId,
        int TaxPercentId,
        decimal Percent,
        decimal TaxBase,
        decimal TaxValue,
        decimal Discount
    );

    public readonly record struct InfoAdicionalDto(
        string Nombre,
        string Valor
    );
}


