namespace Domain.Models
{
    public class Accesos
    {
        public int idAccesos { get; set; }
        public bool estado { get; set; }
    }

    public class accesosOperaciones
    {
        public Accesos accesos { get; set; }
       // public Politica politica { get; set; }
        public Menu menu { get; set; }
        public Acciones acciones { get; set; }
    }
}
