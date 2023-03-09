using DataAccess;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

    }
}
