namespace Billing.Api.Endpoints.Implementations.RetencionAts;

public class DocSustentoEndpoints(IDocSustentoService docSustentoService, IUserContext userContext)
    : IDocSustentoEndpoints
{
    private const string UserRoleClaimType = "userRoleId";

    public async Task<IResult> CreateDocSustento(RetAtsDocSustentoDto retAtsDocSustento)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", DataConverters.SerializeObjectCustom<RetAtsDocSustentoDto>(retAtsDocSustento) }
        };
        return Results.Ok(await docSustentoService.AddAsync(parameters));
    }

    public async Task<IResult> DeleteDocSustento(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id }
        };
        return Results.Ok(await docSustentoService.DeleteAsync(parameters));
    }

    public Task<IResult> GetDocSustentoById(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<IResult> GetDocSustentos(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Results.Ok(await docSustentoService.GetAsync(parameters));
    }

    public async Task<IResult> UpdateDocSustento(int id, RetAtsDocSustentoDto retAtsDocSustento)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom < RetAtsDocSustentoDto >(retAtsDocSustento) }
        };
        return Results.Ok(await docSustentoService.UpdateAsync(parameters));
    }
}
