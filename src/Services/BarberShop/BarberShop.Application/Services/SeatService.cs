using BarberShop.Domain.Repositories;

namespace BarberShop.Application.Services;

public class SeatService(ISeatRepository seatRepository) : ISeatService
{
    public async Task<PagedResult<SeatDto>> GetAllSeatsAsync(PaginationDto paginationDto)
    {
        var pagedSeats = await seatRepository.GetSeatsAsync(paginationDto);

        var seats = pagedSeats.Items.Select(ObjectMapper.Map<Seat, SeatDto>).ToList();

        return new PagedResult<SeatDto>
        {
            Items = seats,
            PageIndex = pagedSeats.PageIndex,
            PageSize = pagedSeats.PageSize,
            TotalCount = pagedSeats.TotalCount
        };
    }

    //public async Task<ApiResponse> GetSeatByIdAsync(int id)
    //{
    //    var seat = await context.Seats.FindAsync(id);
    //    if (seat == null)
    //        return new ApiResponse
    //        {
    //            Code = "0",
    //            Message = "Asiento no encontrado"
    //        };

    //    return new ApiResponse
    //    {
    //        Code = "1",
    //        Message = "Asiento obtenido exitosamente",
    //        Payload = seat
    //    };
    //}

    //public async Task<ApiResponse> UpdateSeatAsync(int id, SeatDto seatDto)
    //{
    //    var seat = await context.Seats.FindAsync(id);
    //    if (seat == null)
    //        return new ApiResponse
    //        {
    //            Code = "0",
    //            Message = "Asiento no encontrado"
    //        };

    //    seat.Name = seatDto.Name;
    //    seat.Description = seatDto.Description;
    //    seat.IsActive = seatDto.IsActive.OrKeep(seat.IsActive);
    //    seat.UpdatedByUserId = seatDto.UpdatedByUserId;
    //    context.Seats.Update(seat);
    //    await context.SaveChangesAsync();
    //    return new ApiResponse
    //    {
    //        Code = "1",
    //        Message = "Asiento actualizado exitosamente",
    //        Payload = seat
    //    };
    //}
}
