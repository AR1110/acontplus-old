using Common.Core.Models;
using DataAccess.Almacen;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Almacen
{
    public class PvPArticuloController : Controller
    {
        private readonly IConfiguration _configuration;
        private ArticuloPvPDao _pvp;
        private GenericResponse _gr;
        public PvPArticuloController(IConfiguration configuration)
        {
            _configuration = configuration;
            _pvp = new ArticuloPvPDao(_configuration);
            _gr = new GenericResponse();
        }
        // GET: PvPArticulo


        public IActionResult Index()
        {
            return View();
        }
        //Gestiones especiales 


        public async Task<IActionResult> GetTarifaPrecio()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _pvp.GetTarifaPrecioAsync(idRol);
            return Ok(res);
        }


        //Listar Pvp articulos por idARticulo 
        public async Task<IActionResult> GetId(int idArticulo)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _pvp.GetIdAsync(idRol, idArticulo);
            return Ok(res);
        }


        //Listar Tarifa para Articulo Fraccionado 
        public async Task<IActionResult> ListArticuloTarifa(int idArticulo)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _pvp.ListArticuloTarifaAsync(idRol, idArticulo);
            return Ok(_gr);
        }


        //Get Pvp para venta 
        public async Task<IActionResult> GetPvPForSale(int idArticulo, string tipo)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _pvp.GetForPvPAsync(idRol, idArticulo, tipo);
            return Ok(res);
        }

    }
}