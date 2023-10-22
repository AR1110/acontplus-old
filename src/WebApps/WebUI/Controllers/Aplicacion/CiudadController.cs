using DataAccess.App;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Aplicacion
{
    public class CiudadController : Controller
    {
        private readonly IConfiguration _configuration;
        public CiudadController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get(string json)
        {
            return Ok(await new CiudadDao(_configuration).GetAsync(json));
        }


    }
}
