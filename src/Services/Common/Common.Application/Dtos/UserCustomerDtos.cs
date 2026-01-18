namespace Common.Application.Dtos;

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

public record UserCustomerCreate(
    string Username,
    string Email,
    string? FirstName,
    string? LastName,
    int CustomerId,
    bool Estado = true
);

public record UserCustomerUpdate(
    string Username,
    string Email,
    string? FirstName,
    string? LastName,
    int CustomerId,
    bool Estado
);

public record UserCustomerCreatedResponse(
    int Id,
    string Username,
    string Email,
    string? FirstName,
    string? LastName,
    string? Fullname,
    bool Estado
);

public record UserCustomerUpdatedResponse(
    int Id,
    string Username,
    string Email,
    string? FirstName,
    string? LastName,
    string? Fullname,
    bool Estado
);