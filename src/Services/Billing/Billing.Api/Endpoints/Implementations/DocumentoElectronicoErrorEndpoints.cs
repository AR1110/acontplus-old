using Billing.Api.Endpoints.Interfaces;

namespace Billing.Api.Endpoints.Implementations;

public class DocumentoElectronicoErrorEndpoints(IDocumentoElectronicoErrorService documentoElectronicoErrorService, IUserContext userContext) : IDocumentoElectronicoErrorEndpoints
{
    public async Task<IResult> GetDocumentoElectronicoErrorByIdAsync(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
            { "id", id }
        };
        return Results.Ok(await documentoElectronicoErrorService.GetAsync(parameters));
    }
}
