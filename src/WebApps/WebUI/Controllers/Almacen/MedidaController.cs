using Common.Core.Models;
using DataAccess;
using DataAccess.Almacen;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Almacen
{
    public class MedidaController : Controller
    {
        // GET: Medida
        private readonly IConfiguration _configuration;

        private DataAccessObject _dao;
        GenericResponse _gr = new();
        private MedidaDao _m;

        public MedidaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
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