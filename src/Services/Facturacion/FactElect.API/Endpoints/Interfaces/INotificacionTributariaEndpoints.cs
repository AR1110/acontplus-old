namespace FactElect.API.Endpoints.Interfaces;

public interface INotificacionTributariaEndpoints
{
    Task<IResult> CreateNotificacionTributariaAsync(NotificacionTributariaDto notificacionTributariaDto);
    Task<IResult> GetNotificacionTributariaByIdAsync(int id);
}