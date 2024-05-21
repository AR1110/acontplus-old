using Common.Core.Interfaces;
using Common.Core.Models;

namespace Common.Application.Services
{
    public class NotificacionService(IADORepository repository) : INotificacionService
    {
        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            return await repository.SPExecuteAsync("App.Notificacion_Serv_Insert", parameters);
        }
    }
}
