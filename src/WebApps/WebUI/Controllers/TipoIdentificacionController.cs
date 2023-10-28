using Common.Core.Models;
using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class TipoIdentificacionController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TipoIdentificacionTransaccionDao ti;

        public TipoIdentificacionController(IConfiguration config)
        {
            _config = config;
            ti = new TipoIdentificacionTransaccionDao(_config);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ReadTipoIdentificacion([FromBody] HelpersResponse data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await ti.ReadTipoIdentificacionAsycn(idRol, data);
            return Ok(_gr);
        }


        public IActionResult GetByType(string tipo)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

            var res = ti.GetByType(idRol, tipo);
            return Ok(res);
        }
    }
}
