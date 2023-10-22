using Domain.Models.Administracion;

namespace Domain.Models
{
    public class Asignaciones
    {
        public int idAsignaciones { get; set; }
        public string fechaRegistro { get; set; }
        public bool estado { get; set; }
    }

    public class asignacionesOperaciones
    {
        public Asignaciones asignaciones { get; set; }
        public Menu menu { get; set; }
        //public Acciones acciones { get; set; }
    }
}