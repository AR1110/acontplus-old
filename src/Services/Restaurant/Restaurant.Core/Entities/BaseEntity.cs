namespace Restaurant.Core.Entities
{
    public class BaseEntity
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
        public bool Enabled { get; set; } = true;
        public bool? Deleted { get; set; }
    }
}
