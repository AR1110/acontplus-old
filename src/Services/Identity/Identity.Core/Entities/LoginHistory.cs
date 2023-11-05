using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Identity.Core.Entities
{
    [Table("LoginHistory", Schema = "Seguridad")]
    public class LoginHistory
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public int UserRoleId { get; set; }
        public string UserAgent { get; set; }
        public DateTime LoginDate { get; set; }
        public bool? IsLoggedIn { get; set; }
        public bool? IsLocked { get; set; }
        [MaxLength(15)]
        public string IpAddress { get; set; }
        public string Token { get; set; }
    }
}
