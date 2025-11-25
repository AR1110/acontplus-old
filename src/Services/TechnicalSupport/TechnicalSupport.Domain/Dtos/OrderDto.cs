namespace TechnicalSupport.Domain.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public int AssignedUserId { get; set; }
    public int CustomerCompanyId { get; set; }
    public int EstablecimientoId { get; set; }
    public DateTime FechaEmision { get; set; }
    public int PuntoEmisionId { get; set; }
    public string? Obs { get; set; }
    public int OrderStatusId { get; set; }
    public int UserId { get; set; }
    public Guid Uuid { get; set; }
    public List<OrderDetailDto> OrderDetails { get; set; } = [];
}
