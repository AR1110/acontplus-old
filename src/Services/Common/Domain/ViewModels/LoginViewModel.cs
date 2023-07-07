namespace Domain.ViewModels
{
    public class LoginData
    {
        public int idRol { get; set; }
        public string userName { get; set; }
        public string fullName { get; set; }
        public string nroIdentificacion { get; set; }
        public int companyId { get; set; }
        public string ruc { get; set; }
        public string image { get; set; }
        public string entidad { get; set; }
        public string nombreComercial { get; set; }
        public string role { get; set; }
        public string actividad { get; set; }
        public string jwtToken { get; set; }
    }
    public class LoginMenu
    {
        public int idMenu { get; set; }
        public bool subMenu { get; set; }
        public string url { get; set; }
        public string icon { get; set; }
        public string description { get; set; }
    }
    public class LoginSubMenu
    {
        public int idMenu { get; set; }
        public int idSubMenu { get; set; }
        public string url { get; set; }
        public string icon { get; set; }
        public string description { get; set; }
    }
    public class LoginViewModel
    {
        public List<LoginData> userData { get; set; }
        public List<LoginMenu> menus { get; set; }
        public List<LoginSubMenu> subMenus { get; set; }
        public string returnUrl { get; set; }
    }


    public class LoginViewModelV2
    {
        public List<LoginData> userData { get; set; }
        public string menus { get; set; }
        public string subMenus { get; set; }
        public string establecimientos { get; set; }
        public string returnUrl { get; set; }
    }
}
