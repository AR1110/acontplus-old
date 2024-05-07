namespace Contabilidad.API.Entities
{
    [Table("Category", Schema = "Contabilidad")]
    public class Category : BaseEntity
    {
        [Required]
        [MaxLength(10)]
        public string Code { get; set; }
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
    }
}
