namespace TechnicalSupport.Application.Dtos;

public record CreateOrderDetailDto
{
    public string Obs { get; init; }
    public string DeviceSerie { get; init; }
    public DateTime? DeviceWarranty { get; init; }
}

public record UpdateOrderDetailDto
{
    public int Id { get; init; }
    public string Obs { get; init; }
    public string DeviceSerie { get; init; }
    public DateTime? DeviceWarranty { get; init; }
}
