namespace Domain.Models.Almacen
{
    public class ArticuloFraccionado
    {
        public int idArticuloFraccionado { get; set; }
        public int idArticulo { get; set; }
        public int idMedida { get; set; }
        public decimal conversion { get; set; }
        public bool gestionVenta { get; set; }
        public bool estado { get; set; }
        public decimal precioCostoFraccionado { get; set; }
    }

}