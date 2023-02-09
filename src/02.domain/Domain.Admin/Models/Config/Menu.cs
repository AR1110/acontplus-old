namespace Domain.Admin.Models
{
    public class Menu
    {
        public long idMenu { get; set; }
        public string codigo{ get; set; }
        public string urlMenu { get; set; }
        public string icono { get; set; }
        public string descripcion { get; set; }
        public bool estado {get; set;}
    }
}