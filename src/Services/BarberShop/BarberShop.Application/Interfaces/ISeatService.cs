namespace BarberShop.Application.Interfaces;

public interface ISeatService
{
    Task<ApiResponse> GetAllSeatsAsync();
    Task<ApiResponse> GetSeatByIdAsync(int id);
    Task<ApiResponse> CreateSeatAsync(SeatDto seatDto);
    Task<ApiResponse> UpdateSeatAsync(int id, SeatDto seatDto);
    Task<ApiResponse> DeleteSeatAsync(int id);
}
