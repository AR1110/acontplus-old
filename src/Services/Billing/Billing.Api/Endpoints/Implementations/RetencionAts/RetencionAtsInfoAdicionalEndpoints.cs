namespace Billing.Api.Endpoints.Implementations.RetencionAts;

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

    public async Task<IResult> CreateRetencionAtsInfoAdicional(RetAtsInfoAdicionalDto retAtsInfoAdicionalDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", DataConverters.SerializeObjectCustom<RetAtsInfoAdicionalDto>(retAtsInfoAdicionalDto)}
        };
        return Results.Ok(await retencionAtsInfoAdicionalService.AddAsync(parameters));
    }

    public async Task<IResult> UpdateRetencionAtsInfoAdicional(int id, RetAtsInfoAdicionalDto retAtsInfoAdicionalDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom<RetAtsInfoAdicionalDto>(retAtsInfoAdicionalDto)}
        };
        return Results.Ok(await retencionAtsInfoAdicionalService.UpdateAsync(parameters));
    }

    public async Task<IResult> DeleteRetencionAtsInfoAdicional(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) }, { "id", id }
        };
        return Results.Ok(await retencionAtsInfoAdicionalService.DeleteAsync(parameters));
    }
}
