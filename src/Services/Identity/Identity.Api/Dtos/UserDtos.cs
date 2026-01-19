namespace Identity.Api.Dtos;

public record UserResponse(
    int Id,
    string? IdCard,
    string Username,
    string Email,
    string? Fullname,
    bool Estado,
    string? FirstName,
    string? LastName
);

public record UserPassword(
    string Password,
    string? ConfirmPassword = null
);
