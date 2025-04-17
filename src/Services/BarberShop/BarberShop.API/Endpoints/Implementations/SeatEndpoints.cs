using BarberShop.API.Endpoints.Interfaces;

namespace BarberShop.API.Endpoints.Implementations;

public class SeatEndpoints : ISeatEndpoints
{
    public Task<IResult> CreateSeatAsync(SeatDto seatDto)
    {
        throw new NotImplementedException();
    }

    public Task<IResult> DeleteSeatAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IResult> GetAllSeatsAsync()
    {
        throw new NotImplementedException();
    }

    public Task<IResult> GetSeatByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IResult> UpdateSeatAsync(int id, SeatDto seatDto)
    {
        throw new NotImplementedException();
    }
}
