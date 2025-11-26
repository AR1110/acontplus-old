namespace Billing.Api.Endpoints.Interfaces;

public interface INotificacionTributariaEndpoints
{
    Task<IResult> CreateNotificacionTributariaAsync(NotificacionTributariaDto notificacionTributariaDto);
    Task<IResult> GetNotificacionTributariaByIdAsync(int id);
}