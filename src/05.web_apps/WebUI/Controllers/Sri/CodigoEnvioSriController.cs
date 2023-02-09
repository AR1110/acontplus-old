using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Sri
{
    public class CodigoEnvioSriController : Controller
    {
        readonly CodigoEnvioSriDao _ces = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get()
        {
            var res = await _ces.GetAsync();
            return Ok(res);
        }
    }
}
