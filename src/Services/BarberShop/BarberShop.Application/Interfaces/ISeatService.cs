using Common.Infrastructure.Data.Repository.Models;

namespace BarberShop.Application.Interfaces;

public interface ISeatService
{
    Task<PagedResult<SeatDto>> GetAllSeatsAsync(PaginationDto paginationDto);
    Task<ApiResponse> GetSeatByIdAsync(int id);
    Task<ApiResponse> CreateSeatAsync(SeatDto seatDto);
    Task<ApiResponse> UpdateSeatAsync(int id, SeatDto seatDto);
    Task<ApiResponse> DeleteSeatAsync(int id);
}
