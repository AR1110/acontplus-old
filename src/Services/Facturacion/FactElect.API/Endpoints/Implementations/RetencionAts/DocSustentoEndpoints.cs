namespace FactElect.API.Endpoints.Implementations.RetencionAts;

public class DocSustentoEndpoints(IDocSustentoService docSustentoService, IUserContext userContext) : IDocSustentoEndpoints
{
    private const string UserRoleClaimType = "userRoleId";

    public async Task<IResult> CreateDocSustento(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return Results.Ok(await docSustentoService.AddAsync(parameters));
    }

    public async Task<IResult> DeleteDocSustento(int id)
    {
        var parameters = new Dictionary<string, object> {
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

    public async Task<IResult> UpdateDocSustento(int id, ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return Results.Ok(await docSustentoService.UpdateAsync(parameters));
    }
}
