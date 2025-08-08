namespace BarberShop.Application.WorkSessions.Interfaces;

public interface IWorkSessionService
{
    Task<PagedResult<WorkSessionDto>> GetWorkSessionAsync(PaginationDto paginationDto);
    Task<ApiResponse> GetWorkSessionByIdAsync(int id);
    Task<ApiResponse> CreateWorkSessionAsync(WorkSessionDto workSessionDto);
    Task<ApiResponse> UpdateWorkSessionAsync(int id, WorkSessionDto workSessionDto);
    Task<ApiResponse> DeleteWorkSessionAsync(int id);
}