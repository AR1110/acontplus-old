namespace Identity.API.Dtos
{
    public class EnterpriseDto
    {
        public string UniqueId { get; set; }
        public string BusinessName { get; set; }
        public string TradeName { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public string Address { get; set; }
        public bool Active { get; set; }
    }
}
