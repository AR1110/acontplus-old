namespace BarberShop.Application.WorkSessions.Dtos;

public class WorkSessionDto
{
    public int PuntoEmisionId { get; set; }

    public int UserBarberId { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int CreatedByUserId { get; set; }
    public int UpdatedByUserId { get; set; }
}
