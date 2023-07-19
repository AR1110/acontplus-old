namespace Domain.Models.GestionTributaria
{
    public class ConfiguracionContribuyente
    {
        public int idConfiguracionContribuyente { get; set; }
        public int idSubContribuyenteEmpresa { get; set; }
        public int idSubContribuyenteProveedor { get; set; }
        public bool renta { get; set; }
        public bool iva { get; set; }
        public string fechaRegistro { get; set; }
    }
}