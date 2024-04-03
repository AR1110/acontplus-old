using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Core.Entities;

namespace Identity.API.Entities
{
    [Table("AccessAuthorization", Schema = "Seguridad")]
    public class AccessAuthorization: BaseEntity
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public Guid Uuid { get; set; }
        public int Code { get; set; }
    }
}
