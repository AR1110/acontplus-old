using Common.Core.Models;
using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Tributaria
{
    public class RetencionIvaController : Controller
    {
        // GET: RetencionIva
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private RetencionIvaDao _ri;

        public RetencionIvaController(IConfiguration config)
        {
            _config = config;
            _ri = new RetencionIvaDao(_config);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RetencionIva data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ri.CreateRetencionIvaAsync(idRol, data);
            return Ok(_gr);
        }

        public IActionResult Get()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = _ri.ReadRetencionIva(idRol);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] RetencionIva data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ri.UpdateRetencionIvaAsync(idRol, data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Delete(int idRetencionIva)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ri.DeleteRetencionIvaAsync(idRol, idRetencionIva);
            return Ok(_gr);
        }

        public async Task<IActionResult> GetByAll()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ri.GetByAllAsync(idRol);
            return Ok(_gr);
        }

    }
}