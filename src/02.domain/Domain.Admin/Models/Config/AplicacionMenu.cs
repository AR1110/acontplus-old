namespace Domain.Admin.Models
{
    public class AplicacionMenu
    {
        public int idAplicacioMenu { get; set; }
        public int idAplicacion { get; set; }
        public int idMenu { get; set; }
        public int idSubMenu { get; set; }
        public string codAplicacion { get; set; }
        public string codMenu { get; set; }
        public string codSubmenu { get; set; }
        public bool estado { get; set; }
    }
}