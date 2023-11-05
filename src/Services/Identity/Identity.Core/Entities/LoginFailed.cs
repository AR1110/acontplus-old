using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Identity.Core.Entities
{
    [Table("LoginFailed", Schema = "Seguridad")]
    public class LoginFailed
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string Username { get; set; }
        [MaxLength(100)]
        public string Password { get; set; }
        public string UserAgent { get; set; }
        public DateTime ErrorDate { get; set; }
        [MaxLength(15)]
        public string IpAddress { get; set; }
    }
}
