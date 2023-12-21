using Asp.Versioning;
using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using FactElect.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace FactElect.API.Controllers.Factura.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
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

        [HttpGet("Get")]
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

        [HttpGet("GetId/{id}")]
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

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] FacturaParamsDto data)
        {
            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Factura_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("jsonFactura", SqlStringParam.Sanitize(data.factura));
                _db.AddDynamicParam("jsonDetalle", SqlStringParam.Sanitize(data.detalle));
                _db.AddDynamicParam("jsonInfoAdicional", SqlStringParam.Sanitize(data.adicional));
                _db.AddDynamicParam("infoAdicionalArticulo", data.infoAdicionalArticulo);
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

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] FacturaParamsDto data)
        {
            var _db = new DbAccess(_configuration);

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Factura_Update");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("jsonFactura", SqlStringParam.Sanitize(data.factura));
                _db.AddDynamicParam("jsonDetalle", SqlStringParam.Sanitize(data.detalle));
                _db.AddDynamicParam("jsonInfoAdicional", SqlStringParam.Sanitize(data.adicional));
                _db.AddDynamicParam("infoAdicionalArticulo", data.infoAdicionalArticulo);
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


        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var _db = new DbAccess(_configuration);

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Factura_Delete");
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
