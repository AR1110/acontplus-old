using Billing.Api.Endpoints.Interfaces;

namespace Billing.Api.Endpoints.Implementations;

public class NotificacionTributariaEndpoints(
    INotificacionTributariaService notificacionTributariaService,
    IUserContext userContext) : INotificacionTributariaEndpoints
{
    public async Task<IResult> CreateNotificacionTributariaAsync(NotificacionTributariaDto notificacionTributariaDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
            { "json", DataConverters.SerializeObjectCustom<NotificacionTributariaDto>(notificacionTributariaDto) }
        };
        return Results.Ok(await notificacionTributariaService.AddAsync(parameters));
    }

    public async Task<IResult> GetNotificacionTributariaByIdAsync(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        return Results.Ok(await notificacionTributariaService.GetAsync(parameters));
    }
}