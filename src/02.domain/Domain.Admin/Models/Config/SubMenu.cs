namespace Domain.Admin.Models
{
    public class SubMenu
    {
        public int idSubMenu { get; set; }
        public int idMenu { get; set; }
        public string codigo { get; set; }
        public string codMenu { get; set; }
        public string urlSubMenu { get; set; }
        public string icono { get; set; }
        public string descripcion { get; set; }
    }
}