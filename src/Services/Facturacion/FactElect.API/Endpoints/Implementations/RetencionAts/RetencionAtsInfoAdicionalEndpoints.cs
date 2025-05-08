namespace FactElect.API.Endpoints.Implementations.RetencionAts;

public class RetencionAtsInfoAdicionalEndpoints(
    IRetencionAtsInfoAdicionalService retencionAtsInfoAdicionalService,
    IUserContext userContext) : IRetencionAtsInfoAdicionalEndpoints
{
    private const string UserRoleClaimType = "userRoleId";

    public Task<IResult> GetRetencionAtsInfoAdicional(string json)
    {
        throw new NotImplementedException();
    }

    public Task<IResult> GetRetencionAtsInfoAdicionalById(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<IResult> CreateRetencionAtsInfoAdicional(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Results.Ok(await retencionAtsInfoAdicionalService.AddAsync(parameters));
    }

    public async Task<IResult> UpdateRetencionAtsInfoAdicional(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Results.Ok(await retencionAtsInfoAdicionalService.UpdateAsync(parameters));
    }

    public async Task<IResult> DeleteRetencionAtsInfoAdicional(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) }, { "id", id },
        };
        return Results.Ok(await retencionAtsInfoAdicionalService.DeleteAsync(parameters));
    }
}
