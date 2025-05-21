using BarberShop.Infrastructure.Data.Repositories.Interfaces;
using BarberShop.Infrastructure.Persistence;
using Common.Infrastructure.Data.Repository.Implementations;
using Common.Infrastructure.Data.Repository.Models;

namespace BarberShop.Infrastructure.Data.Repositories.Implementations;

public class SeatRepository : Repository<Seat>, ISeatRepository
{
    public SeatRepository(BarberShopContext context) : base(context)
    {
    }

    public async Task<PagedResult<Seat>> GetSeatsAsync(PaginationDto paginationDto)
    {
        IQueryable<Seat> query = _dbSet;

        if (!string.IsNullOrEmpty(paginationDto.SearchTerm))
            query = query.Where(u => u.Name.Contains(paginationDto.SearchTerm) ||
                                     u.Code.Contains(paginationDto.SearchTerm) ||
                                     u.Description!.Contains(paginationDto.SearchTerm));

        query = query.OrderBy(u => u.Id);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((paginationDto.PageIndex - 1) * paginationDto.PageSize)
            .Take(paginationDto.PageSize)
            .ToListAsync();

        return new PagedResult<Seat>
        {
            Items = items,
            PageIndex = paginationDto.PageIndex,
            PageSize = paginationDto.PageSize,
            TotalCount = totalCount
        };
    }
}