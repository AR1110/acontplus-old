using Common.Infrastructure.Data.Repository.Models;

namespace BarberShop.Infrastructure.Data.Repositories.Interfaces;

public interface ISeatRepository
{
    Task<PagedResult<Seat>> GetSeatsAsync(PaginationDto paginationDto);
}