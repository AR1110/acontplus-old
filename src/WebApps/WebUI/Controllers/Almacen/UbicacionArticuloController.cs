using DataAccess.Almacen;
using Domain.Models;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class UbicacionArticuloController : Controller
    {
        private readonly IConfiguration _configuration;
        private ArticuloUbicacionDao _ua;
        private GenericResponse _gr;
        public UbicacionArticuloController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ua = new ArticuloUbicacionDao(_configuration);
            _gr = new GenericResponse();
        }
        // GET: UbicacionArticulo  

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ArticuloUbicacion data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ua.InsertAsync(idRol, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Get(int idArticulo)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ua.GetAsync(idRol, idArticulo);
            return Ok(_gr);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] ArticuloUbicacion data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ua.UpdateAsync(idRol, id, data);
            return Ok(_gr);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ua.DeleteAsync(idRol, id);
            return Ok(_gr);
        }
    }
}