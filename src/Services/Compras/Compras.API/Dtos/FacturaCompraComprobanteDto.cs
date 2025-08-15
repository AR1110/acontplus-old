using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Compras.API.Dtos
{
  public record FacturaCompraComprobanteDto : CompraBaseDto
  {
    public required int IdSustentoTributario { get; set; }

    [MaxLength(100)]
    public required string CodEstab { get; set; }

    [MaxLength(50)]
    public required string PuntoEmision { get; set; }

    [MaxLength(50)]
    public required string NroAutorizacion { get; set; }

    [MaxLength(100)]
    public required string CodDoc { get; set; }

    public required DateTime FechaVencimiento { get; set; }

    [Precision(18, 5)]
    public required decimal SubTotalSinImpuestos { get; set; }

    [Precision(18, 5)]
    public required decimal TotalDescuento { get; set; }

    [Precision(18, 5)]
    public required decimal Propina { get; set; }

    [Precision(18, 5)]
    public required decimal Recargo { get; set; }

    [Precision(18, 5)]
    public required decimal Transporte { get; set; }

    [Precision(18, 5)]
    public required decimal Total { get; set; }

    public required int? SubcategoryId { get; set; }

  }
}