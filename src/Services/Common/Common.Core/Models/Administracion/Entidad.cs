namespace Common.Core.Models.Administracion
{

    public class Entidad
    {
        public int idEntidad { get; set; }
        public int idCiudad { get; set; }
        public string ruc { get; set; }
        public string razonSocial { get; set; }
        public string nombreComercial { get; set; }
        public string direccion { get; set; }
        public string telefono { get; set; }
        public string email { get; set; }
        public string imagen { get; set; }
        public bool estado { get; set; }
    }

}