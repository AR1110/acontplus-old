namespace Identity.API.Dtos
{
    public class UserDataDto
    {
        public string BussinesName { get; set; }
        public string CodeRole { get; set; }
        public int CompanyId { get; set; }
        public dynamic Establecimientos { get; set; }
        public string Fullname { get; set; }
        public string IDCardCompany { get; set; }
        public string IDCardUser { get; set; }
        public string Token { get; set; }
        public dynamic Menus { get; set; }
        public string ProfilePicture { get; set; }
        public string Role { get; set; }
        public dynamic Submenus { get; set; }
        public string TradeName { get; set; }
        public string UrlGateway { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public int UserRoleId { get; set; }
    }
}
