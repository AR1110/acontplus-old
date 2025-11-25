namespace Purchases.Application.DTOs
{
    public record ComprobanteDto : CompraBaseDto
    {
        public int? IdPuntoEmision { get; set; }


        public required decimal SubTotalSinImpuestos { get; set; }


        public required decimal TotalDescuento { get; set; }


        public required decimal Propina { get; set; }


        public required decimal Recargo { get; set; }


        public required decimal Transporte { get; set; }


        public required decimal Total { get; set; }
    }
}
