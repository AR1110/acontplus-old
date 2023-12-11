namespace Common.Core.Models.GestionTributaria
{
    public class ConfiguracionContribuyenteDetalle
    {
        public int idConfiguracionContribuyenteDetalle { get; set; }
        public int idConfiguracionContribuyente { get; set; }
        public int idTipoImpuestoRenta { get; set; }
        public int idRetencionIva { get; set; }
        public bool estado { get; set; }
    }

}