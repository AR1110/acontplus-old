using Common.Core.Models;
using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class HorarioController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private HorarioDao _h;

        public HorarioController(IConfiguration config)
        {
            _config = config;
            _h = new HorarioDao(_config);
        }


        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> GetByIdTurno(int idTurno)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _h.ReadHorarioAsync(idRol, idTurno);
            return Ok(res);
        }
        public async Task<IActionResult> ListDia()
        {
            var res = await _h.ListDiaAsycn();
            return Ok(res);
        }
    }
}
