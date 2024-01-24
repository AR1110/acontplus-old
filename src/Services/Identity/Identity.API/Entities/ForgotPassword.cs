using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;
using Common.Core.Utils;
namespace Identity.API.Entities
{
    [Table("ForgotPassword", Schema = "Seguridad")]
    public class ForgotPassword : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Email { get; set; }
        [Required]
        public Guid Token { get; set; } = Guid.NewGuid();
        public DateTime Expiration {  get; set; } = DateUtils.GetEcuadorDate().AddMinutes(5);
    }
}
