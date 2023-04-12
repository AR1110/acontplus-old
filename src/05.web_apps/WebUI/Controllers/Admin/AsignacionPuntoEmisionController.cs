using DataAccess.Asignaciones;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class AsignacionPuntoEmisionController : Controller
    {
        private AsignacionPuntoEmisionDao _asignE;
        private readonly IConfiguration _configuration;
        public AsignacionPuntoEmisionController(IConfiguration configuration)
        {
            _configuration = configuration;
            _asignE = new AsignacionPuntoEmisionDao(_configuration);
        }
        
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRolSession = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);            
            return Ok(await _asignE.GetAsync(json));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AsignacionPuntoEmision data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            return Ok(await _asignE.InsertAsync(idRol, data));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            return Ok(await _asignE.UpdateAsync(idRol, id));
        }
    }
}
