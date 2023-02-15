using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Xml;
using WebUI.Utils;

namespace WebUI.Controllers.Recepcion
{
    public class DocumentoRecibidoController : Controller
    {
        #region PropiedadesPrivadas
        private IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0

        private GenericResponse _response = new GenericResponse();
        private DataAccessObject _dao;
        //private GetDataXmlComprobante _getXmlSriData = new GetDataXmlComprobante();
        private readonly int _idRol;
        public DocumentoRecibidoController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
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

        public async Task<IActionResult> GetFormData()
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("FactElect.Comp_Imp_GetDataForm", parameters)));
        }

        //[HttpPut]
        //public async Task<IActionResult> Put(Guid id, string claveAcceso)
        //{
        //    try
        //    {
        //        string xmlSri = await new WebServiceSri().GetXmlAsync(claveAcceso, _urlSri);
        //        if (xmlSri != null)
        //        {
        //            if (xmlSri.Trim().Length > 500)
        //            {
        //                XmlDocument xmlDocSri = new XmlDocument();
        //                xmlDocSri.LoadXml(xmlSri);

        //                XmlNode nodeAuth = xmlDocSri.GetElementsByTagName("autorizacion")[0];
        //                XmlNode nodeComp = nodeAuth.SelectSingleNode("comprobante");
        //                XmlDocument xmlComp = new XmlDocument();
        //                xmlComp.LoadXml(nodeComp.InnerText);

        //                XmlNode node = xmlComp.GetElementsByTagName("infoTributaria")[0];
        //                string codDoc = node.SelectSingleNode("codDoc").InnerText;

        //                Dictionary<string, object> parameters = new Dictionary<string, object>();
        //                parameters.Add("idRol", _idRol);
        //                parameters.Add("uniqueId", id);
        //                parameters.Add("codDoc", codDoc);
        //                parameters.Add("xmlDoc", nodeAuth.OuterXml);
        //                _response = DbResponse.SPDefault(await _dao.ExecTranAsync("FactElect.ComprobanteImportacionUpdate", parameters));
        //            }
        //            else
        //            {
        //                _response.shortResponse("2", "");
        //            }
        //        }
        //        else
        //        {
        //            _response.message = "No se pudo obtener el XML del SRI";
        //            _response.id = "0";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _ = ex.Message;
        //        _response.shortResponse("0", "Error al obtener el XML del SRI");
        //    }
        //    return Ok(_response);
        //}
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
        
        #endregion
    }
}
