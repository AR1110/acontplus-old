namespace Domain.Models
{
    public class RetencionIva
    {
        public int idRetencionIva { get; set; }
        public string codigo { get; set; }
        public string descripcion { get; set; }
        public decimal porcentaje { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public string descripcionPorc { get; set; }
    }
}