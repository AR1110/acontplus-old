namespace Common.Core.Models.Ventas
{
    public class ProformaDetalle
    {
        public long idProformaDetalle { get; set; }
        public long idProforma { get; set; }
        public int idArticulo { get; set; }
        public int idBodega { get; set; }
        public int idTarifa { get; set; }
        public int idMedida { get; set; }
        public int idTipoIva { get; set; }
        public int idPresentacion { get; set; }
        public decimal cantidad { get; set; }
        public decimal precioUnitario { get; set; }
        public decimal precioConIva { get; set; }
        public decimal valorDescuento { get; set; }
        public decimal porcentajeDescuento { get; set; }
        public decimal total { get; set; }
        public string nota { get; set; }
        public decimal ice { get; set; }
        public string descripcion { get; set; }
    }
}
