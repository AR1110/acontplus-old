namespace Common.Core.Models.Almacen
{
    public class ArticuloImagen
    {
        public int idArticuloImagen { get; set; }
        //public int idArticulo { get; set; }
        //public byte[] imagen { get; set; }
        //public string filename { get; set; }
        //public string contentType { get; set; }
        public string imagenBase64 { get; set; }
        public string mimeType { get; set; }
        public string nombreImagen { get; set; }
        //public string descripcion { get; set; }        

    }

}
