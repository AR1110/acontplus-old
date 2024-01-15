using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoDocumentoController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public TipoDocumentoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }
        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            var _response = new ApiResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.TipoDocumento_Get");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar docs: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar docs");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
