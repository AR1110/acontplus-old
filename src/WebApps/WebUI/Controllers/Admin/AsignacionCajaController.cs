using Common.Core.Models.Administracion;
using DataAccess.Asignaciones;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class AsignacionCajaController : Controller
    {
        private AsignacionCajaDao _ac;
        private readonly IConfiguration _configuration;
        public AsignacionCajaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ac = new AsignacionCajaDao(_configuration);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AsignacionCaja data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ac.InsertAsync(idRol, data);
            return Ok(res);
        }


        [HttpPost]
        public async Task<IActionResult> Put([FromBody] AsignacionCaja data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ac.PutAsyc(idRol, data);
            return Ok(res);
        }
        public async Task<IActionResult> GetByIdCaja(int idCaja)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ac.GetByCajaAsycn(idRol, idCaja);
            return Ok(res);
        }
    }
}
