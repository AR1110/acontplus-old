namespace BarberShop.Api.Endpoints.Implementations;

public class WorkSessionEndpoints(IUserContext userContext, IWorkSessionService workSessionService)
    : IWorkSessionEndpoints
{
    public Task<IResult> GetWorkSessionsAsync(PaginationRequest paginationRequest)
    {
        throw new NotImplementedException();
    }

    public async Task<IResult> GetWorkSessionByIdAsync(int id)
    {
        var result = await workSessionService.GetWorkSessionByIdAsync(id);
        return result.Code == "0" ? Results.NotFound(result.Message) : Results.Ok(result);
    }

    public async Task<IResult> CreateWorkSessionAsync(WorkSessionDto workSessionDto)
    {
        workSessionDto.CreatedByUserId = userContext.GetUserId();
        return Results.Ok(await workSessionService.CreateWorkSessionAsync(workSessionDto));
    }

    public async Task<IResult> UpdateWorkSessionAsync(int id, WorkSessionDto workSessionDto)
    {
        workSessionDto.UpdatedByUserId = userContext.GetUserId();
        return Results.Ok(await workSessionService.UpdateWorkSessionAsync(id, workSessionDto));
    }

    public async Task<IResult> DeleteWorkSessionAsync(int id)
    {
        var result = await workSessionService.DeleteWorkSessionAsync(id);
        return result.Code == "0" ? Results.NotFound(result.Message) : Results.Ok(result);
    }
}
