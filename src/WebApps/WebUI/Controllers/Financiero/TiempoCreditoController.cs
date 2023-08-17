using DataAccess;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Finanzas
{
    public class TiempoCreditoController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TiempoCreditoDao _tc;

        public TiempoCreditoController(IConfiguration config)
        {
            _config = config;
            _tc = new TiempoCreditoDao(_config);
        }


        public IActionResult Index()
        {
            return View();
        }


        //Gestiones Especiales         
        public async Task<IActionResult> OptionTiempoCredito(bool gestion)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _tc.OptionAsync(idRol, gestion);
            return Ok(res);
        }

        public async Task<IActionResult> GetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _tc.GetAllAsync(idRol);
            return Ok(res);
        }
    }
}
