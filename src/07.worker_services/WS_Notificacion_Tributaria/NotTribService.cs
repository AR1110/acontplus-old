using DataAccess;
using System.Data;

namespace WS_Notificacion_Tributaria
{
    public sealed class NotTribService
    {
        private readonly IConfiguration _config;
        public NotTribService(IConfiguration config) => (_config) = (config);

        public async Task<DataTable> Get(int cantDocs)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("FactElect.Not_Trib_Serv_Get");
            _dbAccess.AddDynamicParam("estado", "NE");
            _dbAccess.AddDynamicParam("cantDocs", cantDocs);
            return _dbAccess.GetDataTable();
        }
        public async Task<DataTable> GetDataComprobanteReport(string json)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("Reporte.Management_Get_To_Print");
            _dbAccess.AddDynamicParam("json", json);
            return _dbAccess.GetDataTable();
        }
        public async void Update(long id, string estado, string msgError = null)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("FactElect.Not_Trib_Serv_Update");
            _dbAccess.AddDynamicParam("id", id);
            _dbAccess.AddDynamicParam("estado", estado);
            _dbAccess.AddDynamicParam("msgError", msgError ?? "");
            _dbAccess.OnlyExecute();
        }
    }
}
