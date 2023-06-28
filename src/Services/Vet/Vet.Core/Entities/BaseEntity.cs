using System.ComponentModel;

namespace Vet.Core.Entities
{
    public class BaseEntity
    {
        public int Id { get; set; }
        //[DefaultValue(typeof(DateTime), "")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}