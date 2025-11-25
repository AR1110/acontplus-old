namespace Billing.Api.Endpoints.Implementations.RetencionAts;

public class DocSustentoPagoEndpoints(IDocSustentoPagoService docSustentoPagoService, IUserContext userContext)
    : IDocSustentoPagoEndpoints
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

    public async Task<IResult> CreateDocSustentoRetencionAsync(RetencionAtsPagoDto retencionAtsPagoDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", DataConverters.SerializeObjectCustom<RetencionAtsPagoDto>(retencionAtsPagoDto) }
        };
        return Results.Ok(await docSustentoPagoService.AddAsync(parameters));
    }

    public async Task<IResult> UpdateDocSustentoRetencionAsync(int id, RetencionAtsPagoDto retencionAtsPagoDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom<RetencionAtsPagoDto>(retencionAtsPagoDto) }
        };
        return Results.Ok(await docSustentoPagoService.UpdateAsync(parameters));
    }

    public async Task<IResult> DeleteDocSustentoRetencionAsync(int id, string userId)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") }, { "id", id }
        };
        return Results.Ok(await docSustentoPagoService.DeleteAsync(parameters));
    }
}
