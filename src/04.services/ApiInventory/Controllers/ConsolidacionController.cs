using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApiInventory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConsolidacionController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ConsolidacionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        public async Task<ActionResult<GenericResponse>> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.Consolidacion_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al obtener los datos");
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Get: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
    }
}
