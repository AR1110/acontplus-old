namespace Domain.Models
{
    public class Tarifa
    {
        public int idTarifa { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
        public bool predeterminada { get; set; }
        public bool estado { get; set; }
        public int totalRecords { get; set; }
    }
}