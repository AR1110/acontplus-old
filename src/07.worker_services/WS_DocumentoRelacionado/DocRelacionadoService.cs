using DataAccess;
using System.Data;

namespace WS_DocRelacionado
{
    public sealed class DocRelacionadoService
    {
        private readonly IConfiguration _config;
        public DocRelacionadoService(IConfiguration config) => (_config) = (config);

        public async Task<DataTable> Get(int cantDocs)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("FactElect.Document_Recib_Serv_Get");
            _dbAccess.AddDynamicParam("cantDocs", cantDocs);
            return _dbAccess.GetDataTable();
        }

        public async Task<bool> Insert(int idDocumento, string codDoc, string versionComp)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("FactElect.Doc_Relac_Serv_Insert");
            _dbAccess.AddDynamicParam("idDocumento", idDocumento);
            _dbAccess.AddDynamicParam("codDoc", codDoc);
            _dbAccess.AddDynamicParam("versionComp", versionComp);
            DataTable dt = _dbAccess.GetDataTable();
            return Convert.ToBoolean(dt.Rows[0]["result"]);
        }

        public async Task Update(int idDocumento)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("FactElect.Document_Recib_Serv_Update");
            _dbAccess.AddDynamicParam("idDocumento", idDocumento);
            _dbAccess.OnlyExecute();
        }
    }
}
