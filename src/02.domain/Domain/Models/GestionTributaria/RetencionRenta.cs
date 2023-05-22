namespace Domain.Models.GestionTributaria
{
    public class RetencionRenta
    {
        public int idRetencionRenta { get; set; }
        public int idTipoImpuestoRenta { get; set; }
        public string codigoAnexo { get; set; }
        public string descripcion { get; set; }
        public decimal porcentaje { get; set; }
        public string campoFormulario103 { get; set; }
        public bool estado { get; set; }

    }
}
