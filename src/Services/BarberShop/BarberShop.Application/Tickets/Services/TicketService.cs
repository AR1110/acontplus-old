using BarberShop.Application.Tickets.DTOs;
using BarberShop.Application.Tickets.Interfaces;
using BarberShop.Domain.Repositories;

namespace BarberShop.Application.Tickets.Services;

public class TicketService(ITicketRepository ticketRepository) : ITicketService
{
    public Task<PagedResult<TicketDto>> GetTicketsAsync(PaginationDto paginationDto)
    {
        throw new NotImplementedException();
    }

    public async Task<ApiResponse> GetTicketByIdAsync(int id)
    {
        var ticket = await ticketRepository.GetTicketByIdAsync(id);
        return new ApiResponse(
            ticket is not null ? "1" : "0",
            payload: ticket
        );
    }

    public async Task<ApiResponse> CreateTicketAsync(TicketDto ticketDto)
    {
        return new ApiResponse
        {
            Code = "1",
            Message = "Ticket creado exitosamente",
            Payload = ObjectMapper.Map<Ticket, TicketDto>(
                await ticketRepository.CreateTicketAsync(
                    ObjectMapper.Map<TicketDto, Ticket>(ticketDto)))
        };
    }

    public async Task<ApiResponse> UpdateTicketAsync(int id, TicketDto ticketDto)
    {
        var existingTicket = await ticketRepository.GetTicketByIdAsync(id);
        if (existingTicket == null)
            return new ApiResponse
            {
                Code = "0",
                Message = "Ticket no encontrado!"
            };

        var updatedTicket = ObjectMapper.Map(ticketDto, existingTicket);
        await ticketRepository.UpdateTicketAsync(updatedTicket);

        return new ApiResponse
        {
            Code = "1",
            Message = "Ticket actualizado exitosamente!",
            Payload = ObjectMapper.Map<Ticket, TicketDto>(updatedTicket)
        };
    }

    public async Task<ApiResponse> DeleteTicketAsync(int id)
    {
        await ticketRepository.DeleteTicketAsync(id);
        return new ApiResponse
        {
            Code = "1",
            Message = "Ticket eliminado exitosamente"
        };
    }
}