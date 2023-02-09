namespace Domain.Models.Inventario
{
    public class ConsolidacionInventarioDetalle
    {
        public long idConsolidacionInventarioDetalle { get; set; }
        public long idConsolidacionInventario { get; set; }
        public int idArticulo { get; set; }
        public int idBodega { get; set; }
        public int idMedida { get; set; }
        public decimal cantidad { get; set; }
        public string descripcion { get; set; }
        public decimal precioCosto { get; set; }
        public decimal precioActual { get; set; }
    }
}
