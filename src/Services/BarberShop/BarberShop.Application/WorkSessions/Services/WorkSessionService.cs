using BarberShop.Domain.Repositories;

namespace BarberShop.Application.WorkSessions.Services;

public class WorkSessionService(IWorkSessionRepository workSessionRepository) : IWorkSessionService
{
    public Task<PagedResult<WorkSessionDto>> GetWorkSessionAsync(PaginationDto paginationDto)
    {
        throw new NotImplementedException();
    }

    public async Task<ApiResponse> GetWorkSessionByIdAsync(int id)
    {
        var seat = await workSessionRepository.GetWorkSessionByIdAsync(id);
        if (seat == null)
            return new ApiResponse
            {
                Code = "0",
                Message = "Gestión no encontrada!"
            };

        return new ApiResponse
        {
            Code = "1",
            Payload = seat
        };
    }

    public async Task<ApiResponse> CreateWorkSessionAsync(WorkSessionDto workSessionDto)
    {
        return new ApiResponse
        {
            Code = "1",
            Message = "Gestión creada exitosamente",
            Payload = ObjectMapper.Map<WorkSession, WorkSessionDto>(
                await workSessionRepository.AddWorkSessionAsync(
                    ObjectMapper.Map<WorkSessionDto, WorkSession>(workSessionDto)))
        };
    }

    public async Task<ApiResponse> UpdateWorkSessionAsync(int id, WorkSessionDto workSessionDto)
    {
        var existingSession = await workSessionRepository.GetWorkSessionByIdAsync(id);
        if (existingSession == null)
            return new ApiResponse
            {
                Code = "0",
                Message = "Gestión no encontrada!"
            };

        var updatedSession = ObjectMapper.Map(workSessionDto, existingSession);
        await workSessionRepository.UpdateWorkSessionAsync(updatedSession);

        return new ApiResponse
        {
            Code = "1",
            Message = "Gestión actualizada exitosamente",
            Payload = ObjectMapper.Map<WorkSession, WorkSessionDto>(updatedSession)
        };
    }

    public async Task<ApiResponse> DeleteWorkSessionAsync(int id)
    {
        await workSessionRepository.DeleteWorkSessionAsync(id);
        return new ApiResponse
        {
            Code = "1",
            Message = "Gestión eliminada exitosamente"
        };
    }
}
