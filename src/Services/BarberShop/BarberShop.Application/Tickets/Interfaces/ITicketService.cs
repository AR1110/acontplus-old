using BarberShop.Application.Tickets.DTOs;

namespace BarberShop.Application.Tickets.Interfaces;

public interface ITicketService
{
    Task<PagedResult<TicketDto>> GetTicketsAsync(PaginationDto paginationDto);
    Task<ApiResponse> GetTicketByIdAsync(int id);
    Task<ApiResponse> CreateTicketAsync(TicketDto ticketDto);
    Task<ApiResponse> UpdateTicketAsync(int id, TicketDto ticketDto);
    Task<ApiResponse> DeleteTicketAsync(int id);
}