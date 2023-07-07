namespace Domain.Dtos
{
    public class MenuDto
    {
        public int idMenu { get; set; }
        public string url { get; set; }
        public string icon { get; set; }
        public string description { get; set; }
        public bool subMenu { get; set; }
        public string grupo { get; set; }
    }
    public class SubMenuDto
    {
        public int idMenu { get; set; }
        public string url { get; set; }
        public string icon { get; set; }
        public string description { get; set; }
        public string grupo { get; set; }
    }
    public class AccesoTempDto
    {
        public List<MenuDto> menus { get; set; }
        public List<SubMenuDto> subMenus { get; set; }

    }
}
