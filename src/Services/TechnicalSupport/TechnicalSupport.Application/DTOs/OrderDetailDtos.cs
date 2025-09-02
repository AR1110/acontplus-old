namespace TechnicalSupport.Application.DTOs;

public record CreateOrderDetailDto
{
    public string Obs { get; init; } = string.Empty;
    public string DeviceSerie { get; init; } = string.Empty;
    public DateTime? DeviceWarranty { get; init; }
}

public record UpdateOrderDetailDto
{
    public int Id { get; init; }
    public string Obs { get; init; } = string.Empty;
    public string DeviceSerie { get; init; } = string.Empty;
    public DateTime? DeviceWarranty { get; init; }
}
