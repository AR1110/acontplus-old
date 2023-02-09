
namespace Domain.Admin.Models
{
    public class PlanCliente
    {
        public int idPlanCliente { get; set; }
        public int idEntidad { get; set; }
        public int idLicencia { get; set; }
        public int idSuscripcion { get; set; }
        public string ruc { get; set; }
        public string codLicencia { get; set; }
        public string codSuscripcion { get; set; }
        public decimal valor { get; set; }
        public bool estado { get; set; }
    }
}