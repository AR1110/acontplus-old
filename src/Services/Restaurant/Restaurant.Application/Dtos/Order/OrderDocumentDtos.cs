using System.ComponentModel.DataAnnotations;

namespace Restaurant.Application.Dtos.Order;

public record OrderDocumentCreate
{
    public int OrderId { get; init; }
    [Required][MaxLength(50)] public required string DocumentType { get; init; }
    [Required][MaxLength(100)] public required string DocumentNumber { get; init; }
    [MaxLength(500)] public string? DocumentPath { get; init; }
    public DateTime DocumentDate { get; init; }
    [MaxLength(1000)] public string? Notes { get; init; }
}

public record OrderDocumentUpdate
{
    public int OrderId { get; init; }
    [Required][MaxLength(50)] public required string DocumentType { get; init; }
    [Required][MaxLength(100)] public required string DocumentNumber { get; init; }
    [MaxLength(500)] public string? DocumentPath { get; init; }
    public DateTime DocumentDate { get; init; }
    [MaxLength(1000)] public string? Notes { get; init; }
}

public record OrderDocumentItem
{
    public int Id { get; init; }
    public int OrderId { get; init; }
    public string DocumentType { get; init; }
    public string DocumentNumber { get; init; }
    public string? DocumentPath { get; init; }
    public DateTime DocumentDate { get; init; }
    public string? Notes { get; init; }
    public bool IsActive { get; init; }
}


//conversion a doc (ne,fv)

 
public record OrderDocumentDataDto
{
    public OrderDocumentHeaderDto Comprobante { get; init; }

    public ICollection<OrderDocumentDetailDto> detalles { get; init; }
    public ICollection<TaxDetailDto> impuestos { get; init; }
    public  PaymentDto formaPago { get; init; }
    public ICollection<CuotaDto> cuotas { get; init; }

}

public record OrderDocumentHeaderDto
{
    public int IdCliente { get; set; }
    public int IdPuntoEmision { get; set; }
    public int IdUsuario { get; set; }
    public int IdTiempoCredito { get; set; }

    public string CodDoc { get; set; }
    public string VersionComp { get; set; } = "1.1.0";

    public string FechaEmision { get; set; }
    public string FechaVencimiento { get; set; }

    public decimal SubTotalSinImpuestos { get; set; }
    public decimal TotalDescuento { get; set; }
    public decimal PorcentajeDescuento { get; set; }
    public decimal Propina { get; set; }
    public decimal Recargo { get; set; }
    public decimal Transporte { get; set; }
    public decimal Total { get; set; }

    public string Observacion { get; set; }
    public string DocDestino { get; set; }


}
public record OrderDocumentDetailDto
{
    public int OrderIndex { get; set; }
    public int IdArticulo { get; set; }
    public int IdTarifa { get; set; }
    public int IdBodega { get; set; }
    public int? IdMedida { get; set; }
    public int IdTipoIva { get; set; }

    public decimal Ice { get; set; }
    public decimal Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PrecioSinSubsidio { get; set; } = 0;

    public decimal ValorDescuento { get; set; }
    public decimal PorcentajeDescuento { get; set; }

    public string CodigoPorcentaje { get; set; }
    public decimal Tarifa { get; set; }
    public decimal ValorImpuesto { get; set; }
    public decimal PrecioTotalSinImpuesto { get; set; }

    public string Nota { get; set; }
    public string Descripcion { get; set; }

    public bool LlevaInventario { get; set; }

    public decimal CantidadTransaccion { get; set; }
    public decimal Conversion { get; set; }
    public decimal PrecioCosto { get; set; }
    public decimal PrecioCostoFraccionado { get; set; }

    public int Estado { get; set; }

}


public class TaxDetailDto
{
    public int TaxId { get; set; }
    public int TaxPercentId { get; set; }
    public decimal Percent { get; set; }
    public decimal TaxBase { get; set; }
    public decimal TaxValue { get; set; }
    public decimal Discount { get; set; }
}


public class PaymentDto
{
    public int IdFormaPagoSri { get; set; }
    public int IdTiempoCredito { get; set; }
    public decimal Total { get; set; }
}

public class CuotaDto
{
    public int NroCuota { get; set; }
    public string FechaVencimiento { get; set; }
    public decimal Cuota { get; set; }
    public bool Entrada { get; set; }
}
