using Domain.Models.Almacen;

namespace Domain.Models
{
    public class ComposicionArticuloDetalle
    {
        public int idComposicionArticuloDetalle { get; set; }
        public decimal precioVenta { get; set; }
        public int cantidad { get; set; }
        public decimal total { get; set; }
    }

    public class ComposicionArticuloDetalleOperaciones
    {
        public ComposicionArticuloDetalle composicionArticuloDetalle { get; set; }
        public ComposicionArticulo composicionArticulo { get; set; }
        public Articulo articuloDetalle { get; set; }
        public ArticuloPvP articuloPvPDetalle { get; set; }
        public ArticuloPvP articuloPvP { get; set; }
    }
}