namespace Domain.Models.Compras
{
    public class ManejoArticulo
    {
        public long idManejoArticulo { get; set; }
        public long idArticulo { get; set; }
        public long idManejo { get; set; }
        public long secuencial { get; set; }
        public bool estado { get; set; }
        public bool gestion { get; set; }
    }
}
