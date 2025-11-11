namespace BarberShop.Application.Seats.Interfaces;

public interface ISeatService
{
    Task<PagedResult<SeatDto>> GetSeatsAsync(PaginationRequest paginationRequest);
    Task<SpResponse> GetSeatByIdAsync(int id);
    Task<SpResponse> CreateSeatAsync(SeatDto seatDto);
    Task<SpResponse> UpdateSeatAsync(int id, SeatDto seatDto);
    Task<SpResponse> DeleteSeatAsync(int id);
}
