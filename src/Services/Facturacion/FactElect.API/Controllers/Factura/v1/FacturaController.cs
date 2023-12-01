using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using FactElect.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace FactElect.API.Controllers.Factura.v1
{
    //[Route("api/[controller]")]
    [Route("api/factura/[action]")]
    [ApiController]
    public class FacturaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public FacturaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {

            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Factura_Get", true);
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener datos de factura: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de factura");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Insert(ApiRequest data)
        {

            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Factura_Insert", true);
                _db.AddDynamicParam("userRoleId", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear la factura: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al crear la factura");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ApiRequest data)
        { 
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Factura_Update", true);
                _db.AddDynamicParam("userRoleId", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Update Invoice: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar la factura");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetId(int id)
        { 
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Factura_Get_Id", true);
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
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


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        { 
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Factura_Delete", true);
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar la factura: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar la fcatura");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
