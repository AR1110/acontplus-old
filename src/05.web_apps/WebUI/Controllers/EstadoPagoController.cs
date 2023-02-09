using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class EstadoPagoController : Controller
    {
        EstadoDocumentoDao _eDoc = new();
        [Authorize]
        public ActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _eDoc.GetAsync(json));
        }

        //public async Task<IActionResult> Post(EstadoPago data)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var response = await new EstadoPagoDao().InsertAsync(idRol, data);
        //    return Ok(response);
        //}
        //public async Task<IActionResult> Put(int id, EstadoPago data)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var response = await new EstadoPagoDao().UpdateAsync(idRol, id, data);
        //    return Ok(response);
        //}
        //public async Task<IActionResult> Delete(int id)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var response = await new EstadoPagoDao().DeleteAsync(idRol, id);
        //    return Ok(response);
        //}
    }
}
