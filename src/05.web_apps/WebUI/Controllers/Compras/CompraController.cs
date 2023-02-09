using DataAccess;
using WebUI.Internal.Compras;
using Domain.Models;
using Domain.ViewModels.Compras;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Compras
{
    public class CompraController : Controller
    {
        //FacturaCompraInternal _fc = new();
        IngresoBodegaInternal _ib = new();
        
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }             


        //Orden de Compra 
        //[HttpPost]
        //public async Task<IActionResult> CrudOrdenCompra(int tipo, int idFacturaCompra, [FromBody] FacturaCompraViewModel data)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var res = await _fc.CrudFacturaCompra(tipo, idRol, idFacturaCompra, data);
        //    return Ok(res);
        //}

        //Ingreso a Bodega
        [HttpPost]
        public async Task<IActionResult> PostIngresoBodega(int tipo, int idIngresoBodega, [FromBody] IngresoBodegaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _ib.PostIngresoBoega(tipo, idRol, idIngresoBodega, data);
            return Ok(res);
        }

       
    }
}
