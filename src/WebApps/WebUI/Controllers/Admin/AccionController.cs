using DataAccess;
using Domain.Models;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class AccionController : Controller
    {
        private AccionesDao ac;
        private readonly IConfiguration _configuration;
        public AccionController(IConfiguration configuration)
        {
            _configuration = configuration;
            ac = new AccionesDao(_configuration);
        }
        // GET: Acciones
        GenericResponse _gr = new();

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Acciones data)
        {
            _gr = await ac.CreateAccionesAsync(data);
            return Ok(_gr);
        }
        public async Task<IActionResult> Get()
        {
            _gr = await ac.ReadAccionesAsync();
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] Acciones data)
        {
            _gr = await ac.UpdateAccionesAsync(data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Delete(int idAccion)
        {
            _gr = await ac.DeleteAccionesAsync(idAccion);
            return Ok(_gr);
        }
    }
}