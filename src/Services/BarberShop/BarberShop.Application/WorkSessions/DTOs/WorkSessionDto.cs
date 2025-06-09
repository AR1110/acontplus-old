namespace BarberShop.Application.WorkSessions.DTOs;

public class WorkSessionDto : BaseDto
{
    public int PuntoEmisionId { get; set; }

    public int UserBarberId { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}