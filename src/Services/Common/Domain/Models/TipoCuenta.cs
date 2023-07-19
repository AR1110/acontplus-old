namespace Domain.Models
{
    public class TipoCuenta
    {
        public int idTipoCuenta { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
    }
}