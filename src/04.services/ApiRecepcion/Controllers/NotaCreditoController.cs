using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApiRecepcion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotaCreditoController : ControllerBase
    {
        private readonly IConfiguration _config;
        public NotaCreditoController(IConfiguration config)
        {
            _config = config;
        }
        [Authorize]
        [HttpPost("{id}")]
        public async Task<IActionResult> Post(int id)
        {
            LogWriter _log = new LogWriter(_config);
            GenericResponse _response = new GenericResponse();
            try
            {
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["id"] = id;
                DAO _dao = new DAO(_config);
                _response = await _dao.Default("Recepcion.NotaCredito_Insert", _params);
            }
            catch (Exception ex)
            {
                _log.LogError("Error saving nota credito: " + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar la nota de crédito");
            }
            return Ok(_response);
        }
    }
}
