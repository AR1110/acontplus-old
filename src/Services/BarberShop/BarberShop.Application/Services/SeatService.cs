using BarberShop.Infrastructure.Persistense;

namespace BarberShop.Application.Services;
public class SeatService (BarberShopContext context): ISeatService
{
    public async Task<ApiResponse> CreateSeatAsync(SeatDto seatDto)
    {

        throw new NotImplementedException();
    }

    public async Task<ApiResponse> DeleteSeatAsync(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<ApiResponse> GetAllSeatsAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<ApiResponse> GetSeatByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<ApiResponse> UpdateSeatAsync(int id, SeatDto seatDto)
    {
        throw new NotImplementedException();
    }
}
