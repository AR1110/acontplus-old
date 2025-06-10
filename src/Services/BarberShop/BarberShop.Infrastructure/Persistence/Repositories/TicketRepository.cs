using System.Data;
using BarberShop.Domain.Repositories;
using Common.Core.Abstractions;
using Common.Infrastructure.Repository.Implementations;

namespace BarberShop.Infrastructure.Persistence.Repositories;

public class TicketRepository(BarberShopContext context, IAdoRepository adoRepository)
    : BaseRepository<Ticket>(context), ITicketRepository
{
    public async Task<DataSet> GetTicketsAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.GetDataSetAsync("BarberShop.Ticket_Get", parameters);
    }

    public async Task<Ticket?> GetTicketByIdAsync(int id)
    {
        return await base.GetByIdAsync(id);
    }

    public async Task<Ticket> CreateTicketAsync(Ticket ticket)
    {
        return await base.AddAsync(ticket);
    }

    public async Task<Ticket> UpdateTicketAsync(Ticket ticket)
    {
        return await base.UpdateAsync(ticket);
    }

    public async Task DeleteTicketAsync(int id)
    {
        await base.DeleteByIdAsync(id);
    }
}