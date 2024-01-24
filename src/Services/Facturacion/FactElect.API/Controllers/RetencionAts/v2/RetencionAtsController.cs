using Asp.Versioning;
using Common.Core.Models;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace FactElect.API.Controllers.RetencionAts.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
    public class RetencionAtsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public RetencionAtsController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }

        [HttpPut("Cancel/{id}")]
        public async Task<IActionResult> Cancel(int id)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.RetencionAts_Cancel");
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al anular la retención: " + ex.ToString());
                _response.Create(code: "0", "Error al anular la retención");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}

