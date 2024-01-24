using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KardexController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public KardexController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }
        [HttpGet("Filters")]
        public async Task<IActionResult> Filters()
        {

            ApiResponse _response = new ApiResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Inventario.Kardex_Get_Filters");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on getting kardex" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener el kardex");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {

            ApiResponse _response = new ApiResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Inventario.Kardex_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on getting kardex" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener el kardex");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
