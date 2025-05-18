using BarberShop.Infrastructure.Data.Repositories.Interfaces;
using Common.Infrastructure.Data.Repository.Models;

namespace BarberShop.Application.Services;

public class SeatService(BarberShopContext context, ISeatRepository seatRepository) : ISeatService
{
    public async Task<ApiResponse> CreateSeatAsync(SeatDto seatDto)
    {
        var seat = ObjectMapper.Map<SeatDto, Seat>(seatDto);

        context.Seats.Add(seat);
        await context.SaveChangesAsync();

        return new ApiResponse
        {
            Code = "1",
            Message = "Asiento creato exitosamente",
            Payload = seat
        };
    }

    public async Task<ApiResponse> DeleteSeatAsync(int id)
    {
        var seat = await context.Seats.FindAsync(id);
        if (seat == null)
            return new ApiResponse
            {
                Code = "0",
                Message = "Asiento no encontrado"
            };

        context.Seats.Remove(seat);
        await context.SaveChangesAsync();
        return new ApiResponse
        {
            Code = "1",
            Message = "Asiento eliminado exitosamente"
        };
    }

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

    public async Task<ApiResponse> GetSeatByIdAsync(int id)
    {
        var seat = await context.Seats.FindAsync(id);
        if (seat == null)
            return new ApiResponse
            {
                Code = "0",
                Message = "Asiento no encontrado"
            };

        return new ApiResponse
        {
            Code = "1",
            Message = "Asiento obtenido exitosamente",
            Payload = seat
        };
    }

    public async Task<ApiResponse> UpdateSeatAsync(int id, SeatDto seatDto)
    {
        var seat = await context.Seats.FindAsync(id);
        if (seat == null)
            return new ApiResponse
            {
                Code = "0",
                Message = "Asiento no encontrado"
            };

        seat.Name = seatDto.Name;
        seat.Description = seatDto.Description;
        seat.Enabled = seatDto.Enabled;
        seat.UserId = seatDto.UserId;
        context.Seats.Update(seat);
        await context.SaveChangesAsync();
        return new ApiResponse
        {
            Code = "1",
            Message = "Asiento actualizado exitosamente",
            Payload = seat
        };
    }
}