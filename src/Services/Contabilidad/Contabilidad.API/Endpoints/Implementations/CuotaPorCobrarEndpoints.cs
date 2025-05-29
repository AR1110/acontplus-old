using Contabilidad.API.Endpoints.Interfaces;

namespace Contabilidad.API.Endpoints.Implementations;

public class CuotaPorCobrarEndPoints(IUserContext userContext, ICuotaPorCobrarService _svc) : ICuotaPorCobrarEndpoints
{
    public async Task<IResult> UpdateAsync(CuotaPorCobrarUpdateParamsDto param)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
        { "json", DataConverters.SerializeObjectCustom<CuotaPorCobrarUpdateParamsDto>(param) }
    };
        return Results.Ok(await _svc.UpdateAsync(parameters));
    }
}
