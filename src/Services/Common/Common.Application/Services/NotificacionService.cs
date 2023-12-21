using Common.Core.Interfaces;

namespace Common.Application.Services
{
    public class NotificacionService : INotificacionService
    {
        private readonly IADORepository _repository;
        public NotificacionService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("App.Notificacion_Serv_Insert", parameters);
        }
    }
}
