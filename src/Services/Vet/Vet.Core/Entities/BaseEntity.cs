using System.ComponentModel.DataAnnotations;

namespace Vet.Core.Entities
{
    public class BaseEntity
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(36)]
        public string UniqueId { get; set; } = Guid.NewGuid().ToString();
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}