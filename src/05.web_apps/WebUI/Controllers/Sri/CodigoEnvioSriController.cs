using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Sri
{
    public class CodigoEnvioSriController : Controller
    {
        private readonly IConfiguration _configuration;

        private CodigoEnvioSriDao _ces;
        public CodigoEnvioSriController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ces = new CodigoEnvioSriDao(_configuration);
        }

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
