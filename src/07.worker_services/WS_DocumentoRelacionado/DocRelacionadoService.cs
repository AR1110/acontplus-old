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

        public async Task<DataTable> GetDataXml(int idDocumento, string codDoc, string versionComp)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("FactElect.Document_Recib_Serv_Get_Data_Xml");
            _dbAccess.AddDynamicParam("idDocumento", idDocumento);
            _dbAccess.AddDynamicParam("codDoc", codDoc);
            _dbAccess.AddDynamicParam("versionComp", versionComp);
            return _dbAccess.GetDataTable();
        }

        public async Task<bool> Insert(int idDocumento, string codDoc, string json)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("FactElect.Doc_Relac_Serv_Insert");
            _dbAccess.AddDynamicParam("idDocumento", idDocumento);
            _dbAccess.AddDynamicParam("codDoc", codDoc);
            _dbAccess.AddDynamicParam("json", json);
            return true;
        }

        public async Task<bool> Update(int idDocumento, bool complete)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("FactElect.Document_Recib_Serv_Update");
            _dbAccess.AddDynamicParam("idDocumento", idDocumento);
            _dbAccess.AddDynamicParam("complete", complete);
            return true;
        }
    }
}
