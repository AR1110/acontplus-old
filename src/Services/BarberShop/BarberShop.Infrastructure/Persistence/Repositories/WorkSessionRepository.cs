namespace BarberShop.Infrastructure.Persistence.Repositories;

public class WorkSessionRepository(BarberShopContext context, ILogger<BaseRepository<WorkSession>> logger = null)
    : BaseRepository<WorkSession>(context, logger), IWorkSessionRepository
{
    public Task<PagedResult<WorkSession>> GetWorkSessionsAsync(PaginationDto paginationDto)
    {
        throw new NotImplementedException();
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
