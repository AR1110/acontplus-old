namespace BarberShop.Application.Tickets.Interfaces;

public interface ITicketService
{
    Task<PagedResult<TicketDto>> GetTicketsAsync(PaginationDto paginationDto);
    Task<SpResponse> GetTicketByIdAsync(int id);
    Task<SpResponse> CreateTicketAsync(TicketDto ticketDto);
    Task<SpResponse> UpdateTicketAsync(int id, TicketDto ticketDto);
    Task<SpResponse> DeleteTicketAsync(int id);
}
