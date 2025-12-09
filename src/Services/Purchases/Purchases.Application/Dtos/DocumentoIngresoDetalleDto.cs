namespace Purchases.Application.Dtos
{
    public record DocumentoIngresoDetalleDto : DetalleBaseDto
    {
        public required int OrderIndex { get; set; }

        public int? IdDocumentoIngresoDetail { get; set; }

        public required bool LlevaInventario { get; set; }


        public required decimal CantidadTransaccion { get; set; }


        public required decimal Conversion { get; set; }


        public required decimal PrecioCosto { get; set; }


        public required decimal PrecioCostoFraccionado { get; set; }

        // * Para otras clases con mínimas diferencias
        public int? IdLiquidacionCompraDetalle { get; set; }
        public required int? IdFacturaCompraDetalle { get; set; }
    }
}
