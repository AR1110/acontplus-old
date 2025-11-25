namespace Restaurant.Application.Dtos.Order;

public record OrderKitchenCreate
{
    public int OrderId { get; init; }
    public int? ChefId { get; init; }
    public decimal? Progress { get; init; }
    public bool Completed { get; init; }
}

public record OrderKitchenUpdate
{
    public int OrderId { get; init; }
    public int? ChefId { get; init; }
    public decimal? Progress { get; init; }
    public bool Completed { get; init; }
}

public record OrderKitchenItem
{
    public int Id { get; init; }
    public int OrderId { get; init; }
    public int? ChefId { get; init; }
    public decimal? Progress { get; init; }
    public bool Completed { get; init; }
    public bool IsActive { get; init; }
}
