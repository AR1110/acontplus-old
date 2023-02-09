using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using Helpers;
using Domain.Models.FE;
using WebUI.Utils;
using DataAccess;
using System.Xml;
using Newtonsoft.Json;
using HelpersNS20;
using System.Text;
using Microsoft.AspNetCore.Http;
using FactElect;

namespace WebUI.Controllers.FE
{
    [Authorize]
    public class ComprobanteImportacionController : Controller
    {
        #region PropiedadesPrivadas
        private IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        
        private GenericResponse _response = new GenericResponse();
        private DataAccessObject _dao;
        private GetDataXmlComprobante _getXmlSriData = new GetDataXmlComprobante();
        private readonly string _urlSri = "https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl";
        private readonly int _idRol;
        public ComprobanteImportacionController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        }
        #endregion
        #region ComprobanteImportacion
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.ComprobanteImportacionGet", parameters)));
        }
        [HttpGet]
        public async Task<IActionResult> GetId(Guid id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("uniqueId", id);
            DataTable dt = await _dao.GetDataTableAsync("FactElect.ComprobanteImportacionGetId", parameters);
            if (dt.Rows.Count > 0)
            {
                _response.id = "1";
                string xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
                XmlDocument xdoc = new XmlDocument();
                xdoc.LoadXml(xmlDoc);
                ComprobanteElectronicoXml ceXml = new ComprobanteElectronicoXml();
                string sms = string.Empty;
                if (!_getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
                {
                    _response.Create("0", sms);
                }
                else
                {
                    Dictionary<string, object> parametersTemp = new Dictionary<string, object>();
                    parametersTemp.Add("idRol", _idRol);
                    parametersTemp.Add("idComp", id);
                    parametersTemp.Add("jsonData", JsonConvert.SerializeObject(ceXml.detalles));
                    parametersTemp.Add("impuestos", JsonConvert.SerializeObject(ceXml.impuestos));
                    await _dao.OnlyExecuteAsync("FactElect.CompImpDetailTemp_Insert_All", parametersTemp);
                    _response.payload = ceXml;
                }
            }
            return Ok(_response);
        }
        [HttpGet]
        public async Task<IActionResult> GetFormData()
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("FactElect.Comp_Imp_GetDataForm", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> Post(IFormFile file)
        {
            if (file.ContentType != "text/plain")
            {
                _response.Create("0", "Formato de archivo no soportado");
                return BadRequest(_response);
            }
            try
            {
                string path = _configuration.GetSection("ImportacionTxt").Value;
                FileData.SaveFile(path, file);
                TxtCompImp txtComp = new TxtCompImp();
                DataTable dt = new DataTable("Comprobantes");
                if (txtComp.GetDocs(FileData.GetFileByte(file), ref dt))
                {
                    Dictionary<string, object> parameters = new Dictionary<string, object>();
                    parameters.Add("idRol", _idRol);
                    parameters.Add("json", DataHelper.DataTableToJSON(dt));
                    _response = DbResponse.SPDefault(await _dao.ExecTranAsync("FactElect.ComprobanteImportacionInsert", parameters));

                    if (_response.code == "1")
                    {
                        Parallel.ForEach(dt.AsEnumerable(), drow =>
                        {
                            FastDownload(drow.Field<string>("claveAcceso"));
                        });
                    }
                }
                else
                {
                    _response.Create("0", "No se encontraron registros para importar");
                }
            }
            catch (Exception ex)
            {
                _response.Create("0", "Error al importar el archivo: " + ex.Message);
            }
            return Ok(_response);
        }
        [HttpPut]
        public async Task<IActionResult> Put(Guid id, string claveAcceso)
        {
            try
            {
                string xmlSri = await new WebServiceSri().GetXmlAsync(claveAcceso, _urlSri);
                if (xmlSri != null)
                {
                    if (xmlSri.Trim().Length > 500)
                    {
                        XmlDocument xmlDocSri = new XmlDocument();
                        xmlDocSri.LoadXml(xmlSri);

                        XmlNode nodeAuth = xmlDocSri.GetElementsByTagName("autorizacion")[0];
                        XmlNode nodeComp = nodeAuth.SelectSingleNode("comprobante");
                        XmlDocument xmlComp = new XmlDocument();
                        xmlComp.LoadXml(nodeComp.InnerText);

                        XmlNode node = xmlComp.GetElementsByTagName("infoTributaria")[0];
                        string codDoc = node.SelectSingleNode("codDoc").InnerText;

                        Dictionary<string, object> parameters = new Dictionary<string, object>();
                        parameters.Add("idRol", _idRol);
                        parameters.Add("uniqueId", id);
                        parameters.Add("codDoc", codDoc);
                        parameters.Add("xmlDoc", nodeAuth.OuterXml);
                        _response = DbResponse.SPDefault(await _dao.ExecTranAsync("FactElect.ComprobanteImportacionUpdate", parameters));
                    }
                    else
                    {
                        _response.Create("2", "");
                    }
                }
                else
                {
                    _response.message = "No se pudo obtener el XML del SRI";
                    _response.id = "0";
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                _response.Create("0", "Error al obtener el XML del SRI");
            }
            return Ok(_response);
        }
        [HttpPost]
        public async Task<IActionResult> PostXml(Guid id, string claveAcceso, IFormFile file)
        {
            try
            {
                if (file.ContentType != "text/xml")
                {
                    _response.Create("0", "Formato de archivo no soportado");
                    return BadRequest(_response);
                }
                string xmlSri = Encoding.UTF8.GetString(FileData.GetFileByte(file));
                xmlSri = xmlSri.Replace("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>", "").Replace("</xml>", ""); //DELETE UNNECESARY
                XmlDocument xmlDocSri = new XmlDocument();
                xmlDocSri.LoadXml(xmlSri);
                XmlNode nodeAuth = xmlDocSri.GetElementsByTagName("autorizacion")[0];
                XmlNode nodeComp = nodeAuth.SelectSingleNode("comprobante");
                XmlDocument xmlComp = new XmlDocument();
                xmlComp.LoadXml(nodeComp.InnerText);
                XmlNode node = xmlComp.GetElementsByTagName("infoTributaria")[0];
                string claveAccesoXml = node.SelectSingleNode("claveAcceso").InnerText;
                string codDoc = node.SelectSingleNode("codDoc").InnerText;

                if (claveAcceso != claveAccesoXml)
                {
                    _response.Create("0", "la clave de acceso del xml es es diferente del comprobante seleccionado");
                    return Ok(_response);
                }

                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("idRol", _idRol);
                parameters.Add("uniqueId", id);
                parameters.Add("codDoc", codDoc);
                parameters.Add("xmlDoc", xmlDocSri.OuterXml);
                return Ok(DbResponse.SPDefault(await _dao.ExecTranAsync("FactElect.ComprobanteImportacionUpdate", parameters)));
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
                return Ok(_response);
            } 
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(Guid id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("uniqueId", id);
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.ComprobanteImportacionDelete", parameters)));
        }
        public async void FastDownload(string claveAcceso)
        {
            try
            {
                string xml = await new WebServiceSri().GetXmlAsync(claveAcceso, _urlSri);
                if (xml.Trim().Length > 500)
                {
                    XmlDocument xmlDocSri = new XmlDocument();
                    xmlDocSri.LoadXml(xml);

                    XmlNode nodeAuth = xmlDocSri.GetElementsByTagName("autorizacion")[0];
                    XmlNode nodeComp = nodeAuth.SelectSingleNode("comprobante");
                    XmlDocument xmlComp = new XmlDocument();
                    xmlComp.LoadXml(nodeComp.InnerText);

                    XmlNode node = xmlComp.GetElementsByTagName("infoTributaria")[0];
                    string codDoc = node.SelectSingleNode("codDoc").InnerText;

                    Dictionary<string, object> parameters = new Dictionary<string, object>();
                    parameters.Add("claveAcceso", claveAcceso);
                    parameters.Add("codDoc", codDoc);
                    parameters.Add("xmlDoc", xmlDocSri.OuterXml);
                    await _dao.OnlyExecuteAsync("FactElect.ComprobanteImportacionUpdateFast", parameters);
                }
              
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
        }
        #endregion
        #region "Proveedores"
        [HttpGet]
        public async Task<IActionResult> GetDataProveedor()
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("FactElect.Comp_Imp_Get_Data_Prov", parameters)));
        }
        [HttpGet]
        public async Task<IActionResult> GetProveedor(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("jsonData", json);
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.Comp_Imp_Get_Prov", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> PostProveedor(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("jsonData", json);
            return Ok(DbResponse.SPDataTable(await _dao.ExecTranAsync("FactElect.Comp_Imp_Insert_Prov", parameters)));
        }
        [HttpPut]
        public async Task<IActionResult> PutProveedor(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("jsonData", json);
            return Ok(DbResponse.SPDefault(await _dao.ExecTranAsync("FactElect.", parameters)));
        }
        #endregion
        #region "Articulos"
        [HttpGet]
        public async Task<IActionResult> GetArticlesTemp(Guid uniqueId)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("idComp", uniqueId);
            parameters.Add("jsonData", "");
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.CompImpDetailTemp_Get", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> PostArticleTemp(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("jsonData", json);
            return Ok(DbResponse.SPDefault(await _dao.ExecTranAsync("FactElect.CompImpDetailTemp_Insert", parameters)));
        }
        [HttpPut]
        public async Task<IActionResult> PutArticleTemp(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("jsonData", json);
             return Ok(DbResponse.SPDefault(await _dao.ExecTranAsync("FactElect.CompImpDetailTemp_Update", parameters)));
        }
        [HttpGet]
        public async Task<IActionResult> GetArticles(string jsonData)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("jsonData", jsonData);
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.ComprobanteImportacion_GetArticle", parameters)));
        }
        [HttpGet]
        public async Task<IActionResult> GetArticleHistory(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.Comp_Imp_GetArticle_History", parameters)));
        }
        #endregion
        #region "Comprobante"
        [HttpPost]
        public async Task<IActionResult> PostComprobante(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("jsonComp", json); 
            return Ok(DbResponse.SPDefault(await _dao.ExecTranAsync("FactElect.Comp_Imp_Documento_Insert", parameters)));
        }
        #endregion
    }
}
