using DataAccess;
using Domain.Models;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class ContraPartidaController : Controller
    {
        private readonly IConfiguration _configuration;

        GenericResponse _gr = new();
        private ContraPartidaDao _cp;

        public ContraPartidaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _cp = new ContraPartidaDao(_configuration);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ContraPartida data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _cp.CreateContraPartidaAsync(idRol, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Get()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _cp.ReadContraPartidaAsync(idRol);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] ContraPartida data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _cp.UpdateContraPartidaAsync(idRol, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Delete(int idContraPartida)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _cp.DeleteContraPartidaAsync(idRol, idContraPartida);
            return Ok(_gr);
        }

        //Get By Contrapartida for module cobros 
        //public async Task<IActionResult> GetBy()
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        //    var res = await _cp.GetByAsync(idRol);
        //    return Ok(res);
        //}
    }
}
