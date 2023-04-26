using Common.Logs;
using DataAccess;
using Domain.ViewModels;
using Domain.ViewModels.Compras;
using Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ApiFactElect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public FacturaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }

        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Factura_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al obtener datos de factura: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de factura");
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] FacturaParams data)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);                
                await _db.SPExecute("Ventas.Factura_Insert");
                _db.AddDynamicParam("idRol", idUsuarioRol);                
                _db.AddDynamicParam("jsonFactura", SqlValidation.ValidateSqlString(data.factura));
                _db.AddDynamicParam("jsonDetalle", SqlValidation.ValidateSqlString(data.detalle));
                _db.AddDynamicParam("jsonInfoAdicional", SqlValidation.ValidateSqlString(data.adicional));
                _db.AddDynamicParam("jsonManejoArticulo", SqlValidation.ValidateSqlString(data.manejoArticulo) ?? "");                
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al crear la factura: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al crear la factura");
            }
            return Ok(_response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] FacturaParams data)
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
                _db.AddDynamicParam("jsonManejoArticulo", SqlValidation.ValidateSqlString(data.manejoArticulo) ?? "");
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in Update: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar");
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
