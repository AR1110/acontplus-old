

using Domain.Models.Almacen;

namespace Domain.Models
{
    public class ComposicionArticulo
    {
        public int idComposicionArticulo { get; set; }
        public bool estado { get; set; }
        public string fechaRegistroidUsuario { get; set; }
        public bool imprimirDetalle { get; set; }
        public int cantidadDetalle { get; set; }
    }


    public class ComposicionArticuloOperaciones
    {

        public Articulo articulo { get; set; }
        public ArticuloPvP articuloPvP { get; set; }
        public ComposicionArticulo composicionArticulo { get; set; }

    }
}