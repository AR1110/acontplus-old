namespace BarberShop.Application.WorkSessions.Interfaces;

public interface IWorkSessionService
{
    Task<PagedResult<WorkSessionDto>> GetWorkSessionAsync(PaginationDto paginationDto);
    Task<SpResponse> GetWorkSessionByIdAsync(int id);
    Task<SpResponse> CreateWorkSessionAsync(WorkSessionDto workSessionDto);
    Task<SpResponse> UpdateWorkSessionAsync(int id, WorkSessionDto workSessionDto);
    Task<SpResponse> DeleteWorkSessionAsync(int id);
}
