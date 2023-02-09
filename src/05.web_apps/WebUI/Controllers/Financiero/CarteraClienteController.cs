using DataAccess.GestionFinanciera;
using Domain.Models;
using Domain.Models.GestionFinanciera;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using WebUI.ApiClient;

namespace WebUI.Controllers.GestionFinanciera
{
    public class CarteraClienteController : Controller
    {
        GenericResponse _gr = new();
        readonly CarteraDao _c = new();
        [Authorize]
        public IActionResult Index() => View();

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _c.GetIngresosAsync(idRol, json);
            return Ok(res);
        }
    }
}
