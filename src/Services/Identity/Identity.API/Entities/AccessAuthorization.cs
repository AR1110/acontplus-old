using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Identity.API.Entities
{
    [Table("AccessAuthorization", Schema = "Seguridad")]
    public class AccessAuthorization: BaseEntity
    {
        public int CompanyId { get; set; }
        public int SenderId { get; set; }
        public int SeceiverId { get; set; }
        public Guid Uuid { get; set; }
        [MaxLength(6)]
        public int Code { get; set; }
    }
}
