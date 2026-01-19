namespace Identity.Application.Dtos;

public record UpdateUserDto
{
    public int Id { get; set; }
    [StringLength(100)] public string Username { get; set; }
    [StringLength(100)] public string Password { get; set; }
    [StringLength(13)] public string IdCard { get; set; }
    [StringLength(100)] public string Email { get; set; }
    public int RoleId { get; set; }
    [StringLength(100)] public string FirstName { get; set; }
    [StringLength(100)] public string LastName { get; set; }
    [StringLength(20)] public string PhoneNumber { get; set; }
    public int? DemoStepId { get; set; }
    public bool IsActive { get; set; }
}
