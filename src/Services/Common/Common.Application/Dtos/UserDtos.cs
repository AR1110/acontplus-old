namespace Common.Application.Dtos;

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

public record UserCreate(
    string Username,
    string Email,
    string? FirstName,
    string? LastName,
    int CustomerId,
    bool Estado = true
);

public record UserUpdate(
    string Username,
    string Email,
    string? FirstName,
    string? LastName,
    int CustomerId,
    bool Estado
);

public record UserCreatedResponse(
    int Id,
    string Username,
    string Email,
    string? FirstName,
    string? LastName,
    string? Fullname,
    bool Estado
);

public record UserUpdatedResponse(
    int Id,
    string Username,
    string Email,
    string? FirstName,
    string? LastName,
    string? Fullname,
    bool Estado
);
