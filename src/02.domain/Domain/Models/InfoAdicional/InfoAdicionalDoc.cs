namespace Domain.Models.InfoAdicional
{
    public class InfoAdicionalDoc
    {
        public long idInfoAdicionalDoc { get; set; }
        public long idTipoDocumento { get; set; }
        public long idComprobante { get; set; }
        public long idArticuloInfoAdicional { get; set; }
        public string nombre { get; set; }
        public string valor { get; set; }
        public bool estado { get; set; }
    }
}
