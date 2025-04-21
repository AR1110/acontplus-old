using BarberShop.API.Endpoints.Interfaces;
using BarberShop.Application.Interfaces;

namespace BarberShop.API.Endpoints.Implementations;

public class SeatEndpoints(IUserContext userContext, ISeatService seatService) : ISeatEndpoints
{
    public async Task<IResult> CreateSeatAsync(SeatDto seatDto)
    {
        seatDto.UserId = userContext.GetUserId();
        return Results.Ok(await seatService.CreateSeatAsync(seatDto));
    }

    public async Task<IResult> DeleteSeatAsync(int id)
    {
        return Results.Ok(await seatService.DeleteSeatAsync(id));
    }

    public async Task<IResult> GetAllSeatsAsync()
    {
        return Results.Ok(await seatService.GetAllSeatsAsync());
    }

    public async Task<IResult> GetSeatByIdAsync(int id)
    {
        return Results.Ok(await seatService.GetSeatByIdAsync(id));
    }

    public async Task<IResult> UpdateSeatAsync(int id, SeatDto seatDto)
    {
        seatDto.UserId = userContext.GetUserId();
        return Results.Ok(await seatService.UpdateSeatAsync(id, seatDto));
    }
}
