namespace Purchases.Application.Dtos
{
    public record DetalleBaseDto
    {
        public required int IdArticulo { get; set; }

        public required int IdBodega { get; set; }

        public int? IdMedida { get; set; }

        public required int IdTipoIva { get; set; }


        public required decimal Ice { get; set; }


        public required decimal Cantidad { get; set; }


        public required decimal PrecioUnitario { get; set; }


        public required decimal PorcentajeDescuento { get; set; }

        public required string CodigoPorcentaje { get; set; }


        public required decimal Tarifa { get; set; }


        public required decimal ValorImpuesto { get; set; }


        public required decimal PrecioTotalSinImpuesto { get; set; }

        public string? Nota { get; set; }

        public required string Descripcion { get; set; }


        public decimal? ValorDescuento { get; set; }


        public decimal? Descuento { get; set; }

        public bool? Estado { get; set; } = true;
    }
}
