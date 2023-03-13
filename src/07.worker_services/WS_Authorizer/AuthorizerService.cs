using DataAccess;
using Domain.FactElect;
using System.Data;

namespace WS_Authorizer
{
    public sealed class AuthorizerService
    {
        private readonly IConfiguration _configuration;
        public AuthorizerService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<DataTable> Get(int cantDocs)
        {
            DbAccess _db = new DbAccess(_configuration);
            await _db.SPExecute("FactElect.Doc_Elect_Serv_Get");
            _db.AddDynamicParam("codEstado", 3);
            _db.AddDynamicParam("cantDocs", cantDocs);
            return _db.GetDataTable();
        }
        public async void Update(long id, string xmlAutorized, string dateAutorized, int codEstado)
        {
            DbAccess _db = new DbAccess(_configuration);
            await _db.SPExecute("FactElect.Doc_Elect_Serv_Authorize_Update");
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("codEstado", codEstado);
            _db.AddDynamicParam("xmlSri", xmlAutorized ?? "<NoXml />");
            _db.AddDynamicParam("dateAutorized", dateAutorized ?? "");
            _db.OnlyExecute();
        }
        public async void InsertError(long id, ResponseSriDto data)
        {
            DbAccess _db = new DbAccess(_configuration);
            await _db.SPExecute("FactElect.Doc_Elect_Error_Insert");
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("estado", data.estado ?? "");
            _db.AddDynamicParam("identificador", data.identificador ?? "");
            _db.AddDynamicParam("mensaje", data.message ?? "");
            _db.AddDynamicParam("informacionAdicional", data.informacionAdicional ?? "");
            _db.AddDynamicParam("tipo", data.tipo ?? "");
            _db.AddDynamicParam("xmlSri", data.xmlSri ?? "");
            _db.OnlyExecute();
        }
    }
}
