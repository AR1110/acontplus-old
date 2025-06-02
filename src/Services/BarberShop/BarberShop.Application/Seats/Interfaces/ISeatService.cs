using BarberShop.Application.Seats.DTOs;

namespace BarberShop.Application.Seats.Interfaces;

public interface ISeatService
{
    Task<PagedResult<SeatDto>> GetSeatsAsync(PaginationDto paginationDto);
    Task<ApiResponse> GetSeatByIdAsync(int id);
    Task<ApiResponse> CreateSeatAsync(SeatDto seatDto);
    Task<ApiResponse> UpdateSeatAsync(int id, SeatDto seatDto);
    Task<ApiResponse> DeleteSeatAsync(int id);
}
