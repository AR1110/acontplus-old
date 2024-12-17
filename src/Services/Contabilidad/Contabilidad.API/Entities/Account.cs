namespace Contabilidad.API.Entities
{
    [Table("Account", Schema = "Contabilidad")]
    public class Account : BaseEntity
    {
        [Required][MaxLength(10)] public string Code { get; set; }

        [Required][MaxLength(300)] public string Name { get; set; }
        
        [Required][MaxLength(150)] public string Level { get; set; }

        public Account account { get; set; }
        public int? AccountId { get; set; }
    }
}
