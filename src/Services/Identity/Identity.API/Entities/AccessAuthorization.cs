using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Identity.API.Entities
{
    [Table("AccessAuthorization", Schema = "Seguridad")]
    public class AccessAuthorization
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int SenderId { get; set; }
        public int SeceiverId { get; set; }
        public Guid Uuid { get; set; }
        [MaxLength(6)]
        public int Code { get; set; }
        public DateTime CreateAt { get; set; }
    }
}
