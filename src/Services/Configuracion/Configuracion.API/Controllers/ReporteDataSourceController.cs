using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Configuracion.API.Dtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteDataSourceController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public ReporteDataSourceController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }
        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.ReporteDS_Get");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while getting reports: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error getting reports");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] DataSourceDto data)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.ReporteDS_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", JsonConvert.SerializeObject(data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while insert datasource: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error insert report");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] DataSourceDto data)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.ReporteDS_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", JsonConvert.SerializeObject(data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while updating datasource: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error updating ds");
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

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.ReporteDS_Delete");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while deleting datasource: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error deleting ds");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
