using FactElect.API.Endpoints.Interfaces.RetencionAts;

namespace FactElect.API.Endpoints.Implementations.RetencionAts;

public class RetencionAtsEndpoints(IRetencionAtsService retencionAtsService, IUserContext userContext)
    : IRetencionAtsEndpoints
{
    private const string UserRoleClaimType = "userRoleId";

    public async Task<IResult> GetRetencionAtsAsync(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
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
        var dataSerialized = DataConverters.SerializeDictionary(apiRequest.Data);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(dataSerialized) }
        };

        return Results.Ok(await retencionAtsService.AddAsync(parameters));
    }

    public async Task<IResult> UpdateRetencionAtsAsync(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", SqlStringParam.Sanitize(json) }
        };

        return Results.Ok(await retencionAtsService.UpdateAsync(parameters));
    }

    public async Task<IResult> CancelRetencionAtsAsync(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "id", id }, { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) }
        };
        return Results.Ok(await retencionAtsService.CancelAsync(parameters));
    }

    public async Task<IResult> DeleteRetencionAtsAsync(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "id", id }, { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) }
        };
        return Results.Ok(await retencionAtsService.DeleteAsync(parameters));
    }
}
