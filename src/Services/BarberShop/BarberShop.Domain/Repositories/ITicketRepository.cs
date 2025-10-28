namespace BarberShop.Domain.Repositories;

public interface ITicketRepository
{
    Task<DataSet> GetTicketsAsync(Dictionary<string, object> parameters);
    Task<Ticket?> GetTicketByIdAsync(int id);
    Task<Ticket> CreateTicketAsync(Ticket ticket);
    Task<Ticket> UpdateTicketAsync(Ticket ticket);
    Task DeleteTicketAsync(int id);
}