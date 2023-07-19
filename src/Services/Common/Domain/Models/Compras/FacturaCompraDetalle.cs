namespace Domain.Models.Compras
{
    public class FacturaCompraDetalle
    {
        public long idFacturaCompraDetalle { get; set; }
        public long idFacuraCompra { get; set; }
        public long idMedida { get; set; }
        public long idBodega { get; set; }
        public long idArticulo { get; set; }
        public long idTipoIva { get; set; }
        public decimal cantidad { get; set; }
        public string descripcion { get; set; }
        public string nota { get; set; }
        public decimal precioCosto { get; set; }
        public decimal precioUnitario { get; set; }
        public decimal precioCostoNeto { get; set; }
        public decimal descuento { get; set; }
        public decimal porcentajeDescuento { get; set; }
        public decimal valorDescuento { get; set; }
        public decimal total { get; set; }
        public decimal ice { get; set; }
    }
}
