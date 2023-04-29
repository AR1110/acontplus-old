namespace Domain.Admin.Models
{
    public class Rol
    {
        public int idRol { get; set; }
        public int idPlanCliente { get; set; }
        public string codigo { get; set; }
        public string codPlan { get; set; }
        public string descripcion { get; set; }
        public bool estado { get; set; }
    }
}
