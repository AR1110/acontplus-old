namespace BarberShop.Api.Endpoints.Interfaces;

public interface ISeatEndpoints
{
    Task<IResult> GetSeatsAsync(PaginationRequest paginationRequest);
    Task<IResult> GetSeatByIdAsync(int id);
    Task<IResult> CreateSeatAsync(SeatDto seatDto);
    Task<IResult> UpdateSeatAsync(int id, SeatDto seatDto);
    Task<IResult> DeleteSeatAsync(int id);
}
