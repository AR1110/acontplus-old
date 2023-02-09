using DataAccess.GestionFinanciera;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using WebUI.ApiClient;
using WebUI.Utils;

namespace WebUI.Controllers.GestionFinanciera
{
    public class CarteraProveedorController : Controller
    {
        GenericResponse _gr = new();
        CarteraDao _c = new();
        [Authorize]
        public IActionResult Index() => View();

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _c.GetEgresosAsync(idRol, json);
            return Ok(res);

        }


       
    }
}
