using Common.Services.Extensions;
using Contabilidad.API.Endpoints.Interfaces;

namespace Contabilidad.API.Endpoints.Implementations;

public class CuotaPorCobrarEndPoints(IUserContext userContext, ICuotaPorCobrarService _svc):ICuotaPorCobrarEndpoints
{
    public async Task<IResult> UpdateAsync(CuotaPorCobrarUpdateDto param)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
        { "json", DataConverters.SerializeObjectCustom<CuotaPorCobrarUpdateDto>(param) }
    };
        return Results.Ok(await _svc.UpdateAsync(parameters));
    }
}
