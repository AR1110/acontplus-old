using DataAccess;
using System.Data;

namespace WS_DocumentoRecibido
{
    public sealed class DocumentoService
    {
        private readonly IConfiguration _config;
        public DocumentoService(IConfiguration config) => (_config) = (config);
        public async Task<DataTable> Get(int cantDocs)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("Recepcion.Doc_Service_Get");
            _dbAccess.AddDynamicParam("cantDocs", cantDocs);
            return _dbAccess.GetDataTable();
        }
        public async Task<bool> Update(int idDocumento, string downloaded, string codDoc, string versionComp, string fechaEmision, string xmlDoc)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("Recepcion.Doc_Serv_Update");
            _dbAccess.AddDynamicParam("idDocumento", idDocumento);
            _dbAccess.AddDynamicParam("downloaded", downloaded);
            _dbAccess.AddDynamicParam("codDoc", codDoc);
            _dbAccess.AddDynamicParam("versionComp", versionComp);
            _dbAccess.AddDynamicParam("fechaEmision", fechaEmision);
            _dbAccess.AddDynamicParam("xmlDoc", xmlDoc);
            _dbAccess.OnlyExecute();
            return true;
        }
        public async Task<bool> Update_Error(int idDocumento, string downloaded)
        {
            DbAccess _dbAccess = new DbAccess(_config);
            await _dbAccess.SPExecute("Recepcion.Doc_Serv_Update_Error");
            _dbAccess.AddDynamicParam("idDocumento", idDocumento);
            _dbAccess.AddDynamicParam("downloaded", downloaded);
            _dbAccess.OnlyExecute();
            return true;
        }
    }
}
