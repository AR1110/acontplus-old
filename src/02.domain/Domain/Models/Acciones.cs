namespace Domain.Models
{ 
    public class Acciones
    {
        public int idAcciones { get; set; }
        public string descripcion { get; set; }
        public string codigo { get; set; }
        public bool estado { get; set; }

    }

    public class accionesOperaciones
    {
        public Acciones acciones { get; set; }
        public Menu menu { get; set; }
    }
}