namespace Billing.Api.Endpoints.Implementations.RetencionAts;

public class DocSustentoRetencionEndpoints(
    IDocSustentoRetencionService docSustentoRetencionService,
    IUserContext userContext)
    : IDocSustentoRetencionEndpoints
{
    private const string UserRoleClaimType = "userRoleId";

    public Task<IResult> GetDocSustentoRetencionAsync(string json)
    {
        throw new NotImplementedException();
    }

    public Task<IResult> GetDocSustentoRetencionByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<IResult> CreateDocSustentoRetencionAsync(RetencionAtsRetDto retencionAtsRetDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", DataConverters.SerializeObjectCustom<RetencionAtsRetDto>(retencionAtsRetDto)}
        };
        return Results.Ok(await docSustentoRetencionService.AddAsync(parameters));
    }

    public async Task<IResult> UpdateDocSustentoRetencionAsync(int id, RetencionAtsRetDto retencionAtsRetDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom<RetencionAtsRetDto>(retencionAtsRetDto)}
        };
        return Results.Ok(await docSustentoRetencionService.UpdateAsync(parameters));
    }

    public async Task<IResult> DeleteDocSustentoRetencionAsync(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) }, { "id", id }
        };
        return Results.Ok(await docSustentoRetencionService.DeleteAsync(parameters));
    }
}
