namespace Customer.Core.Entities
{
    public class BaseEntity
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool? Enabled { get; set; }
        public bool? Deleted { get; set; }
    }
}