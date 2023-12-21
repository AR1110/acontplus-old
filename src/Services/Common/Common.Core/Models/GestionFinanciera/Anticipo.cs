namespace Common.Core.Models.GestionFinanciera
{
    public class Anticipo
    {
        public long idAnticipo { get; set; }
        public long idTipoDocumento { get; set; }
        public string codEstab { get; set; }
        public int idCliente { get; set; }
        public int idSubEntidadFinanciera { get; set; }
        public long nroDoc { get; set; }
        public string fechaEmision { get; set; }
        public decimal valor { get; set; }
        public string observaciones { get; set; }
        public bool estado { get; set; }
    }
}
