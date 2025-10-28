namespace BarberShop.Domain.Repositories;

public interface ISeatRepository
{
    Task<PagedResult<Seat>> GetSeatsAsync(PaginationDto paginationDto);
    Task<Seat?> GetSeatByIdAsync(int id);
    Task<Seat> AddSeatAsync(Seat seat);
    Task<Seat> UpdateSeatAsync(Seat seat);
    Task DeleteSeatAsync(int id);
}
