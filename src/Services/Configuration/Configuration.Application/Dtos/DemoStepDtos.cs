namespace Configuration.Application.Dtos;

public record DemoStepCreate(
    string Code,
    string Name,
    string? Description = null,
    bool Mandatory = false,
    int? CreatedByUserId = null);

public record DemoStepUpdate(
    string Code,
    string Name,
    string? Description = null,
    bool Mandatory = false,
    int? UpdatedByUserId = null);

public record DemoStepItem(
    int Id,
    string Code,
    string Name,
    string? Description,
    bool Mandatory,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);