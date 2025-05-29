using Common.Core.Models;

namespace BarberShop.API.Endpoints.Interfaces;

public interface ISeatEndpoints
{
    Task<IResult> GetAllSeatsAsync(PaginationDto paginationDto);
    //Task<IResult> GetSeatByIdAsync(int id);
    //Task<IResult> CreateSeatAsync(SeatDto seatDto);
    //Task<IResult> UpdateSeatAsync(int id, SeatDto seatDto);
    //Task<IResult> DeleteSeatAsync(int id);
}
