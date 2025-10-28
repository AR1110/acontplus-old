namespace BarberShop.Domain.Repositories;

public interface IWorkSessionRepository
{
    Task<PagedResult<WorkSession>> GetWorkSessionsAsync(PaginationDto paginationDto);
    Task<WorkSession?> GetWorkSessionByIdAsync(int id);
    Task<WorkSession> AddWorkSessionAsync(WorkSession workSession);
    Task<WorkSession> UpdateWorkSessionAsync(WorkSession workSession);
    Task DeleteWorkSessionAsync(int id);
}
