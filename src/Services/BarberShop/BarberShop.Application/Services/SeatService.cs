using BarberShop.Infrastructure.Persistense;

namespace BarberShop.Application.Services;
public class SeatService(BarberShopContext context) : ISeatService
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
        {
            return new ApiResponse
            {
                Code = "0",
                Message = "Asiento no encontrado"
            };
        }
        context.Seats.Remove(seat);
        await context.SaveChangesAsync();
        return new ApiResponse
        {
            Code = "1",
            Message = "Asiento eliminado exitosamente"
        };
    }

    public async Task<ApiResponse> GetAllSeatsAsync()
    {
        var seats = await context.Seats.ToListAsync();

        if (seats.Count == 0)
        {
            return new ApiResponse
            {
                Code = "0",
                Message = "Data not found!"
            };
        }

        return new ApiResponse
        {
            Code = "1",
            Message = "Asientos obtenidos exitosamente",
            Payload = seats
        };
    }

    public async Task<ApiResponse> GetSeatByIdAsync(int id)
    {
        var seat = await context.Seats.FindAsync(id);
        if (seat == null)
        {
            return new ApiResponse
            {
                Code = "0",
                Message = "Asiento no encontrado"
            };
        }
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
        {
            return new ApiResponse
            {
                Code = "0",
                Message = "Asiento no encontrado"
            };
        }
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
