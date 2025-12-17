namespace Accounting.Domain.Entities;

[Table("Account", Schema = "Contabilidad")]
public class Account : BaseEntity
{
    public int? ParentAccountId { get; set; } // Clave foránea opcional

    public required Account ParentAccount { get; set; } // Propiedad de navegación a la cuenta padre

    public ICollection<Account> ChildAccounts { get; set; } = []; // Colección de cuentas hijas

    public required Tipo Tipo { get; set; }
    public int? TipoId { get; set; }

    [MaxLength(10)] public required string Code { get; set; }

    [MaxLength(300)] public required string Name { get; set; }

    [MaxLength(150)] public required string Hierarchy { get; set; }

    public bool Level { get; set; }
}
