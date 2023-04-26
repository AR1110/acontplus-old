
namespace Domain.Admin.Models
{
    public class Sistema
    {
        public int idSistema { get; set; }
        public string codigo { get; set; }
        public string descripcion { get; set; }
        public string urlSistema { get; set; }
        public string hostApp { get; set; }
        public string connectionStrings { get; set; }
        public bool estado { get; set; }
    }
}