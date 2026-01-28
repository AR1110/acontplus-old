namespace Configuration.Application.Dtos;

public record SubscriptionTypeCreate(
    string Code,
    string Name,
    int? Quantity,
    int? Duration
);

public record SubscriptionTypeUpdate(
    string Code,
    string Name,
    int? Quantity,
    int? Duration
);

public record SubscriptionTypeItem(
    int Id,
    string Code,
    string Name,
    int? Quantity,
    int? Duration,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
