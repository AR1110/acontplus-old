using DataAccess;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class CiudadController : Controller
    {
        private readonly IConfiguration _configuration;
        GenericResponse _gr = new();
        private CiudadDao _c;
        public CiudadController(IConfiguration configuration)
        {
            _configuration = configuration;
            _c = new CiudadDao(_configuration);
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ReadCiudadProvincia()
        {
            _gr = _c.ReadCiudad();
            return Ok(_gr);
        }
    }
}
