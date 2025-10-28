namespace TechnicalSupport.Domain.DTOs;

public class OrderDetailDto
{
    public int Id { get; set; }
    public int AssignedUserId { get; set; }
    public int DeviceCustomerId { get; set; }
    public int DeviceId { get; set; }
    public string? DeviceSerie { get; set; }
    public string? DeviceWarranty { get; set; }
    public string? Obs { get; set; }
    public Guid Uuid { get; set; }
}
