using BarberShop.Domain.Entities;
using Common.Core.Models;

namespace BarberShop.Domain.Repositories;

public interface ISeatRepository
{
    Task<PagedResult<Seat>> GetSeatsAsync(PaginationDto paginationDto);
}
