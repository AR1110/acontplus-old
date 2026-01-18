namespace Configuration.Application.Dtos;

public record UserCustomerResponse(
    int Id,
    string? IdCard,
    string Username,
    string Email,
    string? Fullname,
    bool Estado,
    string? FirstName,
    string? LastName
);

public record UserCustomerPassword(
    string Password,
    string? ConfirmPassword = null
);
