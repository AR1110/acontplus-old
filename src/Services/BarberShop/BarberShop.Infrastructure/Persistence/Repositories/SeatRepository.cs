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

    public async Task<PagedResult<Seat>> GetSeatsAsync(PaginationRequest paginationRequest)
    {
        IQueryable<Seat> query = _dbSet;

        if (!string.IsNullOrEmpty(paginationRequest.SearchTerm))
            query = query.Where(u => u.Name.Contains(paginationRequest.SearchTerm) ||
                                     u.Code.Contains(paginationRequest.SearchTerm) ||
                                     u.Description!.Contains(paginationRequest.SearchTerm));

        query = query.OrderBy(u => u.Id);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((paginationRequest.PageIndex - 1) * paginationRequest.PageSize)
            .Take(paginationRequest.PageSize)
            .ToListAsync();

        return new PagedResult<Seat>
        {
            Items = items,
            PageIndex = paginationRequest.PageIndex,
            PageSize = paginationRequest.PageSize,
            TotalCount = totalCount
        };
    }

    public async Task<Seat> UpdateSeatAsync(Seat seat)
    {
        return await base.UpdateAsync(seat);
    }
}
