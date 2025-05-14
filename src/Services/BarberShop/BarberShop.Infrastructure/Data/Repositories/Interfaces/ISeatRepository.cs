using Common.Core.DTOs;
using Common.Core.Models;

namespace BarberShop.Infrastructure.Data.Repositories.Interfaces;

public interface ISeatRepository
{
    Task<PagedResult<Seat>> GetSeatsAsync(PaginationDto paginationDto);
}