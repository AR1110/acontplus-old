using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;
using WebUI.Utils;

namespace WebUI.Controllers
{
    public class ValidarDatosController : Controller
    {
        GenericResponse _gr = new();

        ValidacionesExternas ve = new();
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult VerificarDatos([FromBody] HelpersResponse data)
        {
            var res = ve.VerificarDatos(data);
            return Ok(res);
        }
    }
}
