namespace Domain.Models.GestionFinanciera
{
    public class CuentaBancaria
    {
        public long idCuentaBancaria { get; set; }
        public long idBanco { get; set; }
        public string nroCuenta { get; set; }
        public bool tipoCuenta { get; set; }
        public bool estado { get; set; }
    }
}
