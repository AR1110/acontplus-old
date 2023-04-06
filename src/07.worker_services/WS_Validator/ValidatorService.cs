using DataAccess;
using Domain.FactElect;
using Helpers;
using System.Data;
using System.Xml;

namespace WS_Validator
{
    public sealed class ValidatorService
    {
        private readonly IConfiguration _configuration;
        public ValidatorService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<DataTable> Get(int cantDocs)
        {
            DbAccess _db = new DbAccess(_configuration);
            await _db.SPExecute("FactElect.Doc_Elect_Serv_Get");
            _db.AddDynamicParam("codEstado", 2);
            _db.AddDynamicParam("cantDocs", cantDocs);
            return _db.GetDataTable();
        }

        public async void Update(long id, int codEstado)
        {
            DbAccess _db = new DbAccess(_configuration);
            await _db.SPExecute("FactElect.Doc_Elect_Serv_Val_Update");
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("codEstado", codEstado);
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
            if (DataHelper.IsXml(data.xmlSri))
            {
                _db.AddDynamicParam("xmlSri", data.xmlSri);
            }
            else
            {
                XmlDocument xmlDoc = new XmlDocument();
                XmlElement root = xmlDoc.CreateElement("ErrorRequest");
                root.InnerText = $"{data.xmlSri ?? "No Xml Response"}";
                xmlDoc.AppendChild(root);
                _db.AddDynamicParam("xmlSri", xmlDoc.OuterXml);
            }
            _db.OnlyExecute();
        }
    }
}
