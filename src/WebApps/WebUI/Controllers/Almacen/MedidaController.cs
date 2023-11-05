using Common.Core.Models;
using DataAccess.Almacen;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Almacen
{
    public class MedidaController : Controller
    {
        // GET: Medida
        private readonly IConfiguration _configuration;


        GenericResponse _gr = new();
        private MedidaDao _m;

        public MedidaController(IConfiguration configuration)
        {
            _configuration = configuration;

            _m = new MedidaDao(_configuration);
        }

        public IActionResult Index()
        {
            return View();
        }


        //Get By Medida
        public async Task<IActionResult> GetByMedida()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _m.GetByMedida(idRol);
            return Ok(res);
        }
    }
}