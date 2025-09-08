namespace BarberShop.API.Endpoints.Implementations;

public class SeatEndpoints(IUserContext userContext, ISeatService seatService) : ISeatEndpoints
{
    public async Task<IResult> CreateSeatAsync(SeatDto seatDto)
    {
        seatDto.CreatedByUserId = userContext.GetUserId();
        return Results.Ok(await seatService.CreateSeatAsync(seatDto));
    }

    public async Task<IResult> DeleteSeatAsync(int id)
    {
        return Results.Ok(await seatService.DeleteSeatAsync(id));
    }

    public async Task<IResult> GetSeatsAsync(PaginationDto paginationDto)
    {
        var result = await seatService.GetSeatsAsync(paginationDto);
        return Results.Ok(ApiResponse<PagedResult<SeatDto>>.Success(result));
    }

    public async Task<IResult> GetSeatByIdAsync(int id)
    {
        return Results.Ok(await seatService.GetSeatByIdAsync(id));
    }

    public async Task<IResult> UpdateSeatAsync(int id, SeatDto seatDto)
    {
        seatDto.UpdatedByUserId = userContext.GetUserId();
        return Results.Ok(await seatService.UpdateSeatAsync(id, seatDto));
    }
}
