using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class TurnoController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TurnoDao _t;

        public TurnoController(IConfiguration config)
        {
            _config = config;
            _t = new TurnoDao(_config);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Turno data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _t.CreateTurnoAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _t.ReadTurnoAsync(idRol, pageIndex, pageSize);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] Turno data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _t.UpdateTurnoAsync(idRol, data);
            return Ok(res);
        }


        public async Task<IActionResult> Delete(int idTurno)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _t.DeleteTurnoAsync(idRol, idTurno);
            return Ok(res);
        }

        public async Task<IActionResult> ListTurno()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _t.ListTurnoAsync(idRol);
            return Ok(res);
        }
    }
}
