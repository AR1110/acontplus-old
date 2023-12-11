namespace Common.Core.Models
{
    public class FirmaElectronica
    {
        public int idFirmaElectronica { get; set; }
        public int idEntidad { get; set; }
        public string razonSocial { get; set; }
        public string nombre { get; set; }
        public string contrasenia { get; set; }
        public string nombreArchivo { get; set; }
        public string mimeType { get; set; }
        public string dirUrl { get; set; }
        public bool estado { get; set; }
        public DateTime fechaCaducidad { get; set; }
    }
}
