using FactElect.API.Endpoints.Interfaces.RetencionAts;

namespace FactElect.API.Endpoints.Implementations.RetencionAts;

public class RetencionAtsEndpoints(IRetencionAtsService retencionAtsService, IUserContext userContext)
    : IRetencionAtsEndpoints
{
    public async Task<IResult> GetRetencionAtsAsync(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Results.Ok(await retencionAtsService.GetAsync(parameters));
    }

    public Task<IResult> GetRetencionAtsByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<IResult> CreateRetencionAtsAsync(ApiRequest apiRequest)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(apiRequest.Data)) }
        };

        return Results.Ok(await retencionAtsService.AddAsync(parameters));
    }

    public async Task<IResult> UpdateRetencionAtsAsync(int id, ApiRequest apiRequest)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(apiRequest.Data)) }
        };

        return Results.Ok(await retencionAtsService.UpdateAsync(parameters));
    }

    public async Task<IResult> CancelRetencionAtsAsync(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "id", id }, { "userRoleId", userContext.GetClaimValue<int>("userRoleId") }
        };
        return Results.Ok(await retencionAtsService.CancelAsync(parameters));
    }

    public async Task<IResult> DeleteRetencionAtsAsync(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "id", id }, { "userRoleId", userContext.GetClaimValue<int>("userRoleId") }
        };
        return Results.Ok(await retencionAtsService.DeleteAsync(parameters));
    }
}
