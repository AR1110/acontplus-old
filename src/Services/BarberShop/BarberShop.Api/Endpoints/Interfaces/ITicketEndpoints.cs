namespace BarberShop.Api.Endpoints.Interfaces;

public interface ITicketEndpoints
{
    Task<IResult> GetTicketsAsync(PaginationRequest paginationRequest);
    Task<IResult> GetTicketByIdAsync(int id);
    Task<IResult> CreateTicketAsync(TicketDto ticketDto);
    Task<IResult> UpdateTicketAsync(int id, TicketDto ticketDto);
    Task<IResult> DeleteTicketAsync(int id);
}
