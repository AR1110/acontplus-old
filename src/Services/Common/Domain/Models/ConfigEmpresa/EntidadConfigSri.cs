namespace Domain.Models.ConfigEmpresa
{
    public class EntidadConfigSri
    {
        public int idEntidadConfigSri { get; set; }
        public int idEntidad { get; set; }
        public int idSubContribuyente { get; set; }
        public int idAnioFiscal { get; set; }
        public string ruc { get; set; }
        public string codSubContribuyente { get; set; }
        public string actividad { get; set; }
        public bool obligadoLlevarContabilidad { get; set; }
        public string nroContribuyente { get; set; }
        public bool estado { get; set; }
    }
}
