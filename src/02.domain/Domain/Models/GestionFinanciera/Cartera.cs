namespace Domain.Models.GestionFinanciera
{
    public class Cartera
    {
        public int id { get; set; }
        public string nroIdentificacion { get; set; }
        public string nombreComercial { get; set; }
        public int idDocumento { get; set; }
        public string codigo { get; set; }
        public string nroDoc { get; set; }
        public string fechaEmision { get; set; }
        public string fechaVencimiento { get; set; }

        public int expira { get; set; }
        public string estadoFinanciero { get; set; }

        public decimal total { get; set; }
        public decimal abono { get; set; }
        public decimal saldo { get; set; }
    }

    public class CarteraSearch
    {
        public int idRol { get; set; }
        public int byType { get; set; }
        public int byCliente { get; set; }
        public int byProveedor { get; set; }
        public int byEstado { get; set; }
        public string fechaInicio { get; set; }
        public string fechaFin { get; set; }
        public string fechaVencimiento { get; set; }
    }
}
