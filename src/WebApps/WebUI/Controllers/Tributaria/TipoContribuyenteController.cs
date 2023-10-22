using DataAccess;
using Domain.Models;
using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Tributaria
{
    public class TipoContribuyenteController : Controller
    {
        // GET: TipoContribuyente
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TipoContribuyenteDao _tc;

        public TipoContribuyenteController(IConfiguration config)
        {
            _config = config;
            _tc = new TipoContribuyenteDao(_config);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TipoContribuyente data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _tc.CreateTipoContribuyenteAsync(idRol, data);
            return Ok(_gr);
        }
        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _tc.ReadTipoContribuyente(idRol, pageIndex, pageSize);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] TipoContribuyente data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _tc.UpdateTipoContribuyenteAsync(idRol, data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Delete(int idTipoContribuyente)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _tc.DeleteTipoContribuyenteAsync(idRol, idTipoContribuyente);
            return Ok(_gr);
        }

        public async Task<IActionResult> OptionTipoContribuyente()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _tc.OptionTipoContribuyenteAsync(idRol);
            return Ok(_gr);
        }
    }
}