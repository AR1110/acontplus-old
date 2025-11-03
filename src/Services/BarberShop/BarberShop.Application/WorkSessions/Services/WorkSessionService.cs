namespace BarberShop.Application.WorkSessions.Services;

public class WorkSessionService(IWorkSessionRepository workSessionRepository) : IWorkSessionService
{
    public Task<PagedResult<WorkSessionDto>> GetWorkSessionAsync(PaginationDto paginationDto)
    {
        throw new NotImplementedException();
    }

    public async Task<SpResponse> GetWorkSessionByIdAsync(int id)
    {
        var seat = await workSessionRepository.GetWorkSessionByIdAsync(id);
        return seat == null
            ? new SpResponse
            {
                Code = "0",
                Message = "Gestión no encontrada!"
            }
            : new SpResponse
            {
                Code = "1",
                Payload = seat
            };
    }

    public async Task<SpResponse> CreateWorkSessionAsync(WorkSessionDto workSessionDto)
    {
        return new SpResponse
        {
            Code = "1",
            Message = "Gestión creada exitosamente",
            Payload = ObjectMapper.Map<WorkSession, WorkSessionDto>(
                await workSessionRepository.AddWorkSessionAsync(
                    ObjectMapper.Map<WorkSessionDto, WorkSession>(workSessionDto)))
        };
    }

    public async Task<SpResponse> UpdateWorkSessionAsync(int id, WorkSessionDto workSessionDto)
    {
        var existingSession = await workSessionRepository.GetWorkSessionByIdAsync(id);
        if (existingSession == null)
            return new SpResponse
            {
                Code = "0",
                Message = "Gestión no encontrada!"
            };

        var updatedSession = ObjectMapper.Map(workSessionDto, existingSession);
        await workSessionRepository.UpdateWorkSessionAsync(updatedSession);

        return new SpResponse
        {
            Code = "1",
            Message = "Gestión actualizada exitosamente",
            Payload = ObjectMapper.Map<WorkSession, WorkSessionDto>(updatedSession)
        };
    }

    public async Task<SpResponse> DeleteWorkSessionAsync(int id)
    {
        await workSessionRepository.DeleteWorkSessionAsync(id);
        return new SpResponse
        {
            Code = "1",
            Message = "Gestión eliminada exitosamente"
        };
    }
}
