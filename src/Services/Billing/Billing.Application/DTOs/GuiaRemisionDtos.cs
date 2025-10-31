namespace Billing.Application.DTOs;

public static class GuiaRemisionDtos
{
    public readonly record struct CreateGuiaRemisionDto(
        InfoGuiaRemisionDto InfoGuiaRemision,
        IReadOnlyList<DetalleDto> Detalles,
        IReadOnlyList<InfoAdicionalDto> InfoAdicional
    );

    public readonly record struct UpdateGuiaRemisionDto(
        int Id,
        InfoGuiaRemisionDto InfoGuiaRemision,
        IReadOnlyList<DetalleUpdateDto> Detalles,
        IReadOnlyList<InfoAdicionalDto> InfoAdicional
    );

    public readonly record struct InfoGuiaRemisionDto(
        int IdPuntoEmision,
        int IdCliente,
        int IdTransportista,
        int IdVehiculo,
        int? IdEmpleado,
        int? IdFactura,
        int? IdNotaEntrega,
        int? IdAprob_Document,
        DateTime FechaEmision,
        DateTime FechaInicio,
        DateTime FechaFin,
        string DocAduanero,
        string PtoPartida,
        string PtoLlegada,
        string Ruta,
        string EstableDestino,
        string Entregar,
        string Motivo
    );

    public readonly record struct DetalleDto(
        int OrderIndex,
        int IdArticulo,
        decimal Cantidad,
        string Descripcion
    );

    public readonly record struct DetalleUpdateDto(
        int OrderIndex,
        int IdGuiaRemisionDetalle,
        int IdArticulo,
        decimal Cantidad,
        string Descripcion,
        bool Estado
    );

    public readonly record struct InfoAdicionalDto(
        string Nombre,
        string Valor
    );
}


