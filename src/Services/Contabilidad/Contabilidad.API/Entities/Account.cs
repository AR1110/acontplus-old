namespace Contabilidad.API.Entities;

[Table("Account", Schema = "Contabilidad")]
public class Account : BaseEntity
{
    public int? ParentAccountId { get; set; } // Clave foránea opcional

    public Account ParentAccount { get; set; } // Propiedad de navegación a la cuenta padre

    public ICollection<Account> ChildAccounts { get; set; } // Colección de cuentas hijas

    public Tipo tipo { get; set; }
    public int? TipoId { get; set; }

    [Required] [MaxLength(10)] public string Code { get; set; }

    [Required] [MaxLength(300)] public string Name { get; set; }

    [Required] [MaxLength(150)] public string Hierarchy { get; set; }

    public bool Level { get; set; }
}