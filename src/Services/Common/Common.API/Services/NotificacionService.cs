namespace Common.API.Services;

public class NotificacionService(IAdoSqlServer adoSqlServer) : INotificacionService
{
    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>("App.Notificacion_Serv_Insert", parameters);
    }
}
