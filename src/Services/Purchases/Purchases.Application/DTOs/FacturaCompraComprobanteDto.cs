using System.ComponentModel.DataAnnotations;

namespace Purchases.Application.DTOs
{
    public record FacturaCompraComprobanteDto : CompraBaseDto
    {
        public required int IdFacturaCompra { get; set; }
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


        public required decimal SubTotalSinImpuestos { get; set; }


        public required decimal TotalDescuento { get; set; }


        public required decimal Propina { get; set; }


        public required decimal Recargo { get; set; }


        public required decimal Transporte { get; set; }


        public required decimal Total { get; set; }

        public required int? SubcategoryId { get; set; }

    }
}
