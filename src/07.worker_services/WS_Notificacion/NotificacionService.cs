using DataAccess;
using System.Data;

namespace WS_Notificacion
{
    public sealed class NotificacionService
    {
        private readonly IConfiguration _config;
        public NotificacionService(IConfiguration config) => (_config) = (config);

        public async Task<DataTable> Get(int cantidad)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("App.Notificacion_Serv_Get");
            _dbAccess.AddDynamicParam("cantidad", cantidad);
            return _dbAccess.GetDataTable();
        }
        public async void Update(int id, string estado, string msgError = null)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("App.Notificacion_Serv_Update");
            _dbAccess.AddDynamicParam("id", id);
            _dbAccess.AddDynamicParam("estado", estado);
            _dbAccess.AddDynamicParam("msgError", msgError ?? "");
            _dbAccess.OnlyExecute();
        }
    }
}
