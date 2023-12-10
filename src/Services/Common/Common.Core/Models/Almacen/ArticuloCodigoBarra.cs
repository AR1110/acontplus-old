namespace Common.Core.Models.Almacen
{
    public class ArticuloCodigoBarra
    {
        public int idArticuloCodigoBarra { get; set; }
        public int idArticulo { get; set; }
        public int idMedida { get; set; }
        public string codigoBarra { get; set; }
        public string descripcion { get; set; }
        public string color { get; set; }
        public bool estado { get; set; }
        public bool codigoBarraPrincipal { get; set; }
        public bool codigoPrincipal { get; set; }
    }

    public class ArticuloCodigoBarraOperaciones
    {
        public ArticuloCodigoBarra articuloCodigoBarra { get; set; }
        public Medida medida { get; set; }
        public Articulo articulo { get; set; }
    }
}