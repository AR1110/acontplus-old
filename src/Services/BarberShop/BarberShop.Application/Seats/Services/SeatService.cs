using BarberShop.Application.Seats.DTOs;
using BarberShop.Application.Seats.Interfaces;
using BarberShop.Domain.Repositories;

namespace BarberShop.Application.Seats.Services;

public class SeatService(ISeatRepository seatRepository) : ISeatService
{
    public async Task<ApiResponse> CreateSeatAsync(SeatDto seatDto)
    {
        return new ApiResponse
        {
            Code = "1",
            Message = "Asiento creado exitosamente",
            Payload = ObjectMapper.Map<Seat, SeatDto>(await seatRepository.AddSeatAsync(ObjectMapper.Map<SeatDto, Seat>(seatDto)))
        };
    }

    public async Task<ApiResponse> DeleteSeatAsync(int id)
    {
        await seatRepository.DeleteSeatAsync(id);
        return new ApiResponse
        {
            Code = "1",
            Message = "Asiento eliminado exitosamente"
        };
    }

    public async Task<PagedResult<SeatDto>> GetSeatsAsync(PaginationDto paginationDto)
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
        var seat = await seatRepository.GetSeatByIdAsync(id);
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
        var existingSeat = await seatRepository.GetSeatByIdAsync(id);
        if (existingSeat == null)
            return new ApiResponse
            {
                Code = "0",
                Message = "Asiento no encontrado"
            };
        var updatedSeat = ObjectMapper.Map(seatDto, existingSeat);
        updatedSeat.Id = id;
        return new ApiResponse
        {
            Code = "1",
            Message = "Asiento actualizado exitosamente",
            Payload = ObjectMapper.Map<Seat, SeatDto>(await seatRepository.UpdateSeatAsync(updatedSeat))
        };
    }
}
