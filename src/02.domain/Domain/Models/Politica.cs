namespace Domain.Models
{

    public class Politica
    {
        public int idPolitica { get; set; }
        public string descripcion { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public string fechaBaja { get; set; }
        public string codigo { get; set; }
        public int totalRecords { get; set; }
    }

}