using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImpresoraController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public ImpresoraController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }


        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("ApiPrinter.Impresora_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Get Printers: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener las impresoras");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpGet("GetDataForm")]
        public async Task<IActionResult> GetDataForm(string json)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("ApiPrinter.Impresora_Get_Data_Form");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error in GetDataForm: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("ApiPrinter.Impresora_Get_Id");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error in GetId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpPost]
        public async Task<IActionResult> Post(ApiRequest parameters)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("ApiPrinter.Impresora_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.Data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error in Post Printer: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        public async Task<IActionResult> Put(ApiRequest parameters)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("ApiPrinter.Impresora_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.Data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {


                _log.LogActivity("Error in Put Printers: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("ApiPrinter.Impresora_Delete");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error in Delete Printer: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
