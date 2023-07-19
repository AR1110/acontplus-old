using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Almacen
{
    public class TarifaController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TarifaDao _t;

        public TarifaController(IConfiguration config)
        {
            _config = config;
            _t = new TarifaDao(_config);
        }


        public IActionResult Index()
        {
            return View();
        }

        //Gestiones especiales 
        //get list tarifa para select en el Modulo de VENTA
        public async Task<IActionResult> Select()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _t.SelectAync(idRol);
            return Ok(_gr);
        }

        public async Task<IActionResult> GetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _t.SelectAync(idRol);
            return Ok(_gr);
        }

    }
}
