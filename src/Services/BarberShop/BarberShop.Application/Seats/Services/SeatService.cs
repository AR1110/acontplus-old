namespace BarberShop.Application.Seats.Services;

public class SeatService(ISeatRepository seatRepository) : ISeatService
{
    public async Task<SpResponse> CreateSeatAsync(SeatDto seatDto)
    {
        return new SpResponse
        {
            Code = "1",
            Message = "Asiento creado exitosamente",
            Payload = ObjectMapper.Map<Seat, SeatDto>(await seatRepository.AddSeatAsync(ObjectMapper.Map<SeatDto, Seat>(seatDto)))
        };
    }

    public async Task<SpResponse> DeleteSeatAsync(int id)
    {
        await seatRepository.DeleteSeatAsync(id);
        return new SpResponse
        {
            Code = "1",
            Message = "Asiento eliminado exitosamente"
        };
    }

    public async Task<PagedResult<SeatDto>> GetSeatsAsync(PaginationRequest paginationRequest)
    {
        var pagedSeats = await seatRepository.GetSeatsAsync(paginationRequest);

        var seats = pagedSeats.Items.Select(ObjectMapper.Map<Seat, SeatDto>).ToList();

        return new PagedResult<SeatDto>
        {
            Items = seats,
            PageIndex = pagedSeats.PageIndex,
            PageSize = pagedSeats.PageSize,
            TotalCount = pagedSeats.TotalCount
        };
    }

    public async Task<SpResponse> GetSeatByIdAsync(int id)
    {
        var seat = await seatRepository.GetSeatByIdAsync(id);
        return seat == null
            ? new SpResponse
            {
                Code = "0",
                Message = "Asiento no encontrado"
            }
            : new SpResponse
            {
                Code = "1",
                Message = "Asiento obtenido exitosamente",
                Payload = seat
            };
    }

    public async Task<SpResponse> UpdateSeatAsync(int id, SeatDto seatDto)
    {
        var existingSeat = await seatRepository.GetSeatByIdAsync(id);
        if (existingSeat == null)
            return new SpResponse
            {
                Code = "0",
                Message = "Asiento no encontrado"
            };
        var updatedSeat = ObjectMapper.Map(seatDto, existingSeat);
        return new SpResponse
        {
            Code = "1",
            Message = "Asiento actualizado exitosamente",
            Payload = ObjectMapper.Map<Seat, SeatDto>(await seatRepository.UpdateSeatAsync(updatedSeat))
        };
    }
}
