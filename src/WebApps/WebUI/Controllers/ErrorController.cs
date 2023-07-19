using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class ErrorController : Controller
    {
        [Route("Error/{statusCode}")]
        public IActionResult HttpStatusCodeHandler(int statusCode)
        {
            switch (statusCode)
            {
                case 404:
                    ViewBag.ErrorMessage = "Lo siento, no se pudo encontrar el recurso que solicitaste";
                    break;
            }
            return View("PageNotFound");
        }
    }
}
