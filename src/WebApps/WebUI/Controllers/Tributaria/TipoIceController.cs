using Common.Core.Models;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Tributaria
{
    public class TipoIceController : Controller
    {
        // GET: TipoIce
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TipoIceDao _ti;

        public TipoIceController(IConfiguration config)
        {
            _config = config;
            _ti = new TipoIceDao(_config);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TipoIce data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ti.CreateTipoIceAsync(idRol, data);
            return Ok(_gr);
        }
        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ti.ReadTipoIceAsync(idRol, pageIndex, pageSize);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] TipoIce data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ti.UpdateTipoIceAsync(idRol, data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Delete(int idTipoIce)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ti.DeleteTipoIceAsync(idRol, idTipoIce);
            return Ok(_gr);
        }


        //Operaciones Especiales 
        public async Task<IActionResult> OptionTipoIce()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ti.OptionTipoIceAsync(idRol);
            return Ok(_gr);
        }
    }
}