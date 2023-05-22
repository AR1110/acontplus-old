namespace Domain.Models.Config
{
    public class ConfigContribuyente
    {
        public int idConfigContribuyente { get; set; }
        public int idSubContribuyenteEmpresa { get; set; }
        public int idSubContribuyenteProveedor { get; set; }
        public bool renta { get; set; }
        public bool iva { get; set; }
        public string fechaRegistro { get; set; }

    }
}
