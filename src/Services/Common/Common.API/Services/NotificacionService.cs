namespace Common.API.Services;

public class NotificacionService(IAdoRepository repository) : INotificacionService
{
    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync("App.Notificacion_Serv_Insert", parameters);
    }
}
