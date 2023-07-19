using Domain.Models.Almacen;

namespace Domain.Models
{
    public class ArticuloPvP
    {
        public int idArticuloPvP { get; set; }
        public int idTarifa { get; set; }
        public decimal precioVenta { get; set; }
        public decimal precioConIva { get; set; }
        public decimal porcentajeUtilidad { get; set; }
        public bool estado { get; set; }
        public bool precioPredeterminado { get; set; }

    }
    public class ArticuloPvPOperaciones
    {
        public ArticuloPvP articuloPvP { get; set; }
        public Articulo articulo { get; set; }
        public TipoIva tipoIva { get; set; }
        public Tarifa tarifa { get; set; }
    }
}