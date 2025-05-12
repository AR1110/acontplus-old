namespace FactElect.Domain.Entities;

[Table("Customer", Schema = "Customer")]
public class AppCustomer : BaseEntity
{
    public int IdTypeId { get; init; }
    [Required][MaxLength(15)] public required string IdCard { get; init; }

    [Required][MaxLength(300)] public required string BusinessName { get; init; }

    [MaxLength(300)] public string? TradeName { get; init; }

    [MaxLength(500)] public string? Email { get; init; }

    [MaxLength(300)] public string? Telephone { get; init; }

    [MaxLength(500)] public string? Address { get; init; }

    public bool? SriValidation { get; init; }
}
