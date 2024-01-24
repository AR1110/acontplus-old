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
        public async Task<IActionResult> Post(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    { "userRoleId", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value) },
                    { "json", SqlStringParam.Sanitize(json) },
                };

                var response = await _notificacion.AddAsync(parameters);

                if (response == null || string.IsNullOrEmpty(response))
                {
                    return BadRequest("Can't Save");
                };
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
