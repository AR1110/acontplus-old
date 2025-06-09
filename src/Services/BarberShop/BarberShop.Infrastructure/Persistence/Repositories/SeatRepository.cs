using BarberShop.Domain.Repositories;
using Common.Core.Models;
using Common.Infrastructure.Repository.Implementations;

namespace BarberShop.Infrastructure.Persistence.Repositories;

public class SeatRepository(BarberShopContext context) : BaseRepository<Seat>(context), ISeatRepository
{
    public async Task<Seat> AddSeatAsync(Seat seat)
    {
        return await base.AddAsync(seat);
    }

    public async Task DeleteSeatAsync(int id)
    {
        await base.DeleteByIdAsync(id);
    }

    public async Task<Seat?> GetSeatByIdAsync(int id)
    {
        return await base.GetByIdAsync(id);
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

    public async Task<Seat> UpdateSeatAsync(Seat seat)
    {
        return await base.UpdateAsync(seat);
    }
}
