using Azure.Core;
using Common.Core.Models;
using Common.Core.Utils;
using Compras.API.Interfaces;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Compras.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        private readonly IProveedorService _proveedorService;
        public ProveedorController(IConfiguration configuration, LogWriter log, IProveedorService proveedorService)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
            _proveedorService = proveedorService;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _proveedorService.GetAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null) { return Ok(new { code = "0", message = "No se encontro Datos" }); }
                return Ok(new { code = "1", payload = response });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener el proveedor: " + ex.ToString());
                return BadRequest(ex.Message);
            }

        }
        [HttpPost]
        public async Task<IActionResult> Post(ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _proveedorService.AddAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            { 
                return BadRequest(ex.Message);
            } 
        }
        [HttpPut("{json}")]
        public async Task<IActionResult> Put(string json)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Proveedor_Update");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("jsonData", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar el proveedor: " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar el proveedor");
            }
            finally
            {
                _db.Close();
            }

            return Ok(_response);
        }
    }
}
