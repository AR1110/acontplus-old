namespace Common.Core.Models.Compras
{
    public class ManejoArticuloDetalle
    {
        public long idManejoArticuloDetalle { get; set; }
        public long idManejoArticulo { get; set; }
        public long idEtiqueta { get; set; }
        public string descripcion { get; set; }
        public bool estado { get; set; }
        public int secuencial { get; set; }
    }
}
