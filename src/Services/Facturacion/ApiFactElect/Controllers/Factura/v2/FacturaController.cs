using DataAccess;
using Domain.ViewModels;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiFactElect.Controllers.Factura.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
    public class FacturaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public FacturaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Factura_Get_v2", true);
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al obtener datos de factura: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de factura");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] FacturaParams data)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Factura_Insert_v2");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("jsonFactura", SqlValidation.ValidateSqlString(data.factura));
                _db.AddDynamicParam("jsonDetalle", SqlValidation.ValidateSqlString(data.detalle));
                _db.AddDynamicParam("jsonInfoAdicional", SqlValidation.ValidateSqlString(data.adicional));
                _db.AddDynamicParam("infoAdicionalArticulo", data.infoAdicionalArticulo);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al crear la factura: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al crear la factura");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] FacturaParams data)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Factura_Update");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("jsonFactura", SqlValidation.ValidateSqlString(data.factura));
                _db.AddDynamicParam("jsonDetalle", SqlValidation.ValidateSqlString(data.detalle));
                _db.AddDynamicParam("jsonInfoAdicional", SqlValidation.ValidateSqlString(data.adicional));
                _db.AddDynamicParam("infoAdicionalArticulo", data.infoAdicionalArticulo);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in Update Invoice: \n" + ex.ToString());
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
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Factura_Delete");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al eliminar la factura: \n" + ex.ToString());
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
