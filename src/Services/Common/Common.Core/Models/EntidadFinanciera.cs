namespace Common.Core.Models
{
    public class EntidadFinanciera
    {
        public int idEntidadFinanciera { get; set; }
        public int idFormaPagoSri { get; set; }
        public string descripcion { get; set; }
        public bool detalle { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
    }
}
