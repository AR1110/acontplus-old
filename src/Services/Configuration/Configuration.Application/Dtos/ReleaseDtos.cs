namespace Configuration.Application.Dtos;

public record ReleaseItem(
    int Id,
    int AplicacionId,
    string AplicacionName,
    DateTime ReleaseDate,
    string? Version,
    string Title,
    string Content,
    bool LogoutRequired,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record ReleaseCreatedResponse(
    int Id,
    int AplicacionId,
    string AplicacionName,
    DateTime ReleaseDate,
    string? Version,
    string Title,
    string Content,
    bool LogoutRequired,
    bool IsActive,
    DateTime CreatedAt,
    int CreatedByUserId
);

public record ReleaseUpdatedResponse(
    int Id,
    int AplicacionId,
    string AplicacionName,
    DateTime ReleaseDate,
    string? Version,
    string Title,
    string Content,
    bool LogoutRequired,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int CreatedByUserId,
    int UpdatedByUserId
);

public record ReleaseCreate(
    int AplicacionId,
    DateTime ReleaseDate,
    string? Version,
    string Title,
    string Content,
    bool LogoutRequired
);

public record ReleaseUpdate(
    int AplicacionId,
    DateTime ReleaseDate,
    string? Version,
    string Title,
    string Content,
    bool LogoutRequired
);