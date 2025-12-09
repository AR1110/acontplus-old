namespace Billing.Api.Endpoints.Implementations.RetencionAts;

public class DocSustentoImpuestoEndpoints(
    IDocSustentoImpuestoService docSustentoImpuestoService,
    IUserContext userContext)
    : IDocSustentoImpuestoEndpoints
{
    private const string UserRoleClaimType = "userRoleId";

    public Task<IResult> GetDocSustentoImpuestoAsync(string json)
    {
        throw new NotImplementedException();
    }

    public Task<IResult> GetDocSustentoImpuestoByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<IResult> CreateDocSustentoImpuestoAsync(RetAtsImpDocSustentoDto retAtsImpDocSustentoDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", DataConverters.SerializeObjectCustom<RetAtsImpDocSustentoDto>(retAtsImpDocSustentoDto) }
        };
        return Results.Ok(await docSustentoImpuestoService.AddAsync(parameters));
    }

    public async Task<IResult> UpdateDocSustentoImpuestoAsync(int id, RetAtsImpDocSustentoDto retAtsImpDocSustentoDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom<RetAtsImpDocSustentoDto>(retAtsImpDocSustentoDto) }
        };
        return Results.Ok(await docSustentoImpuestoService.UpdateAsync(parameters));
    }

    public async Task<IResult> DeleteDocSustentoImpuestoAsync(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) }, { "id", id }
        };
        return Results.Ok(await docSustentoImpuestoService.DeleteAsync(parameters));
    }
}
