namespace Billing.Api.Endpoints.Implementations.RetencionAts;

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

    public async Task<IResult> GetRetencionAtsByIdAsync(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id }
        };
        return Results.Ok(await retencionAtsService.GetByIdAsync(parameters));
    }

    public async Task<IResult> CreateRetencionAtsAsync(RetencionAtsDto retencionAtsDto)
    {
        var dataSerialized = DataConverters.SerializeObjectCustom<RetencionAtsDto>(retencionAtsDto);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(dataSerialized) }
        };

        return Results.Ok(await retencionAtsService.AddAsync(parameters));
    }

    public async Task<IResult> UpdateRetencionAtsAsync(int id, RetencionAtsDto RetencionAtsDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            {
                "json",
                SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<RetencionAtsDto>(RetencionAtsDto))
            }
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