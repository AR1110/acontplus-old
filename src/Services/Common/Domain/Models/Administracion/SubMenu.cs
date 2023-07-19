namespace Domain.Models.Administracion
{
    public class SubMenu
    {
        public long idSubMenu { get; set; }
        public long idMenu { get; set; }
        public string url { get; set; }
        public string icono { get; set; }
        public string descripcion { get; set; }
        public bool estado { get; set; }
        public string codTemp { get; set; }
    }
}
