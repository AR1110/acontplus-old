namespace BarberShop.Infrastructure.Persistence.Repositories;

public class WorkSessionRepository(BarberShopContext context, ILogger<BaseRepository<WorkSession>> logger = null)
    : BaseRepository<WorkSession>(context, logger), IWorkSessionRepository
{
  public async Task<PagedResult<WorkSession>> GetWorkSessionsAsync(PaginationRequest paginationRequest)
  {
    IQueryable<WorkSession> query = _dbSet.AsNoTracking();

    query = query.OrderByDescending(session => session.StartDate);

    var totalCount = await query.CountAsync();

    var items = await query
        .Skip((paginationRequest.PageIndex - 1) * paginationRequest.PageSize)
        .Take(paginationRequest.PageSize)
        .ToListAsync();

    return new PagedResult<WorkSession>
    {
      Items = items,
      PageIndex = paginationRequest.PageIndex,
      PageSize = paginationRequest.PageSize,
      TotalCount = totalCount
    };
  }

  public async Task<WorkSession?> GetWorkSessionByIdAsync(int id)
  {
    return await base.GetByIdAsync(id);
  }

  public async Task<WorkSession> AddWorkSessionAsync(WorkSession workSession)
  {
    return await base.AddAsync(workSession);
  }

  public async Task<WorkSession> UpdateWorkSessionAsync(WorkSession workSession)
  {
    return await base.UpdateAsync(workSession);
  }

  public async Task DeleteWorkSessionAsync(int id)
  {
    await base.DeleteByIdAsync(id);
  }
}
