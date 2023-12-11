using Common.Core.Interfaces;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Common.API.Controllers
{
    public class NotificacionController : BaseApiController
    {
        private readonly INotificacionService _notificacion;
        private readonly LogWriter _log;
        public NotificacionController(INotificacionService notificacion, LogWriter log)
        {
            _notificacion = notificacion;
            _log = log;
        }
        [HttpPost]
        public async Task<IActionResult>Post(string json)
        {
            try
            {
                var response = await _notificacion.AddAsync(new Dictionary<string, object> { { "json", SqlStringParam.Sanitize(json) } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Cant Save"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Post: {json} \\n {ex}");
                return BadRequest(ex.Message);
            }
        }
    }
}
