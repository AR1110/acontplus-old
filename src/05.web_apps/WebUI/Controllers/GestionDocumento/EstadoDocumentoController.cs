using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionDocumento
{
    public class EstadoDocumentoController : Controller
    {
        EstadoDocumentoDao _eDoc = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _eDoc.GetAsync(json));
        }

    }
}
