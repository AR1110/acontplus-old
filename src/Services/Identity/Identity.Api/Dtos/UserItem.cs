namespace Identity.Api.Dtos;

public record UserItem
{
    public Guid Uuid { get; set; }

    [StringLength(13)] public required string IdCard { get; set; }

    [MaxLength(100)] public required string Username { get; set; }

    [MaxLength(100)] public required string Email { get; set; }

    [MaxLength(100)] public string? Password { get; set; }

    [MaxLength(300)] public required string FirstName { get; set; }
    [MaxLength(300)] public required string LastName { get; set; }
}
