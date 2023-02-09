using ApiProveedores.Utils;
using BL.Proveedores;
using Common.Logs;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace ApiProveedores.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoRecibidoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public DocumentoRecibidoController(IConfiguration configuration) => (_configuration) = (configuration);
        [Authorize]
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "json", SqlValidation.ValidateSqlString(json) }
                };
                return Ok(await _dao.GetDataTable("Recepcion.Documento_Get", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener los documentos recibidos: " + ex.StackTrace);
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener los documentos recibidos"
                });
            }
            
        }
        //[HttpGet]
        //public async Task<IActionResult> GetId(Guid id)
        //{
        //    Dictionary<string, object> parameters = new Dictionary<string, object>();
        //    parameters.Add("uniqueId", id);
        //    DataTable dt = await _dao.GetDataTableAsync("Recepcion.ComprobanteImportacionGetId", parameters);
        //    if (dt.Rows.Count > 0)
        //    {
        //        _response.id = "1";
        //        string xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
        //        XmlDocument xdoc = new XmlDocument();
        //        xdoc.LoadXml(xmlDoc);
        //        ComprobanteElectronicoXml ceXml = new ComprobanteElectronicoXml();
        //        string sms = string.Empty;
        //        if (!_getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
        //        {
        //            _response.Create("0", sms);
        //        }
        //        else
        //        {
        //            Dictionary<string, object> parametersTemp = new Dictionary<string, object>();
        //            parametersTemp.Add("idRol", _idRol);
        //            parametersTemp.Add("idComp", id);
        //            parametersTemp.Add("jsonData", JsonConvert.SerializeObject(ceXml.detalles));
        //            parametersTemp.Add("impuestos", JsonConvert.SerializeObject(ceXml.impuestos));
        //            await _dao.OnlyExecuteAsync("FactElect.CompImpDetailTemp_Insert_All", parametersTemp);
        //            _response.payload = ceXml;
        //        }
        //    }
        //    return Ok(_response);
        //}
        [HttpPost]
        public async Task<IActionResult> Post(IFormFile file)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            DAO _dao = new DAO(_configuration);
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
                    //parameters.Add("idRol", _idRol);
                    parameters.Add("json", DataHelper.DataTableToJSON(dt));
                    _response = await _dao.Default("Recepcion.Documento_Insert", parameters);
                }
                else
                {
                    _response.Create("0", "No se encontraron registros para importar");
                }
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al importar el archivo: " + ex.Message);
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al importar el archivo"
                });
            }
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(Guid id)
        {
            LogWriter _logs = new LogWriter(_configuration);

            try
            {
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("uniqueId", id);
                return Ok(await _dao.Default("Recepcion.Documento_Delete", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al eliminar el archivo: " + ex.Message);
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al importar el archivo"
                });
            }
        }
    }
}
