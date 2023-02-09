using Domain.Models.Almacen;

namespace Domain.Models
{
    public class ArticuloUbicacion
    {
        public int idArticuloUbicacion { get; set; }
        public int idArticulo { get; set; }
        public int idBodega { get; set; }
        public string ubicacion { get; set; }
        public bool estado { get; set; }
    }

    public class ArticuloUbicacionOperaciones
    {
        public ArticuloUbicacion articuloUbicacion { get; set; }
        public Bodega bodega { get; set; }
        public Articulo articulo { get; set; }
    }
}