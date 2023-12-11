namespace Common.Core.Models.GestionTributaria
{
    public class ImpuestoArticulo
    {
        public long idImpuestoArticulo { get; set; }
        public long idArticulo { get; set; }
        public long idSubContribuyente { get; set; }
        public long idRetencionRenta { get; set; }

    }
}
