namespace Common.Core.Models
{
    public class Banco
    {
        public int idBanco { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }
        public string fechaRegistro { get; set; }
        public int idUsuario { get; set; }
        public int totalRecords { get; set; }
    }
}