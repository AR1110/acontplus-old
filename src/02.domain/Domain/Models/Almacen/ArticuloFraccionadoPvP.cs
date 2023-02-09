namespace Domain.Models.Almacen
{
    public class ArticuloFraccionadoPvP
    {
        public int idArticuloFraccionadoPvP { get; set; }
        public int idArticuloFraccionado { get; set; }

        public int idTarifa { get; set; }

        public decimal precioVenta { get; set; }
        public decimal precioConIva { get; set; }
        public decimal porcentajeUtilidad { get; set; }
        public bool estado { get; set; }
    }
}