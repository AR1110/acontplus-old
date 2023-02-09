namespace Domain.Models
{
    public class Empresa
    {
        public int idEmpresa { get; set; }
        public string ruc { get; set; }
        public string razonSocial { get; set; }
        public string nombreComercial { get; set; }
        public bool estado { get; set; }
    }
}
