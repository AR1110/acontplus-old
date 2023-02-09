using DataAccess.Administracion;
using Domain.Models.Administracion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class ActividadEtiquetaController : Controller
    {
        private readonly IConfiguration _config;
        private ActividadEtiquetaDao _ae;
        public ActividadEtiquetaController(IConfiguration config, ActividadEtiquetaDao ae)
        {
            _config = config;
            _ae = new ActividadEtiquetaDao(_config);
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _ae.GetAsync(json));
        }


        public async Task<IActionResult> Post([FromBody] ActividadEtiqueta data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _ae.InsertAsync(idRol, data));
        }

        public async Task<IActionResult> Put(int id, [FromBody] ActividadEtiqueta data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _ae.UpdateAsync(idRol, id, data));
        }


    }
}
