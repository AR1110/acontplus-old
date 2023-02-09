using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Aplicacion
{
    public class CiudadController : Controller
    {
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get(string json)
        {
            return Ok(await new CiudadDao().GetAsync(json));
        }


    }
}
