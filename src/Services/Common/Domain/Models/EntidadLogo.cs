namespace Domain.Models
{
    public class EntidadLogo
    {
        public int idEntidadLogo { get; set; }
        public int idEntidad { get; set; }
        public string entidad { get; set; }
        public byte[] imagen { get; set; }
        public string mimeType { get; set; }
        public string nombreImagen { get; set; }
        public bool estado { get; set; }
    }
}
