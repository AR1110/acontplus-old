namespace BarberShop.API.Endpoints.Interfaces;

public interface ITicketEndpoints
{
    Task<IResult> GetTicketsAsync(PaginationDto paginationDto);
    Task<IResult> GetTicketByIdAsync(int id);
    Task<IResult> CreateTicketAsync(TicketDto ticketDto);
    Task<IResult> UpdateTicketAsync(int id, TicketDto ticketDto);
    Task<IResult> DeleteTicketAsync(int id);
}
