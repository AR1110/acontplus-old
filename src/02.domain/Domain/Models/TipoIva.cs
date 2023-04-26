namespace Domain.Models
{
    public class TipoIva
    {
        public int idTipoIva { get; set; }
        public string descripcion { get; set; }
        public decimal porcentaje { get; set; }
        public int codigoPorcentaje { get; set; }
        public int codigoSRIPri { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public int totalRecords { get; set; }
    }
}