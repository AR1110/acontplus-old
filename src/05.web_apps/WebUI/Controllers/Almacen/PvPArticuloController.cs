using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Almacen;
using Helpers;

namespace WebUI.Controllers
{
    public class PvPArticuloController : Controller
    {
        // GET: PvPArticulo
        GenericResponse _gr = new();
        ArticuloPvPDao _pvp = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

       

        //Gestiones especiales 
        

        public async Task<IActionResult> GetTarifaPrecio()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _pvp.GetTarifaPrecioAsync(idRol);
            return Ok(res);
        }


        //Listar Pvp articulos por idARticulo 
        public async Task<IActionResult> GetId(int idArticulo)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _pvp.GetIdAsync(idRol, idArticulo);
            return Ok(res);
        }


        //Listar Tarifa para Articulo Fraccionado 
        public async Task<IActionResult> ListArticuloTarifa(int idArticulo)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _pvp.ListArticuloTarifaAsync(idRol, idArticulo);
            return Ok(_gr);
        }


        //Get Pvp para venta 
        public async Task<IActionResult> GetPvPForSale(int idArticulo, string tipo)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _pvp.GetForPvPAsync(idRol, idArticulo, tipo);
            return Ok(res);
        }
        
        


    }
}