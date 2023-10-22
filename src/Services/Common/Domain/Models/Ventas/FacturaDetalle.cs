namespace Domain.Models.Ventas
{
    public class FacturaDetalle
    {
        public int idFacturaDetalle { get; set; }
        public int idFactura { get; set; }
        public decimal cantidad { get; set; }
        public decimal precioVenta { get; set; }
        public decimal precioConIva { get; set; }
        public decimal valorDescuento { get; set; }
        public decimal porcentajeDescuento { get; set; }
        public decimal total { get; set; }
        public string nota { get; set; }
        public int idArticulo { get; set; }
        public int idBodega { get; set; }
        public int idTarifa { get; set; }
        public int idMedida { get; set; }
        public decimal ice { get; set; }
        public string descripcion { get; set; }
        public int idPresentacion { get; set; }
        public int idTipoIva { get; set; }
    }
}
