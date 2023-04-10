using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DataAccess.GestionTributaria;
using Domain.Models.GestionTributaria;
using Helpers;

namespace WebUI.Controllers
{
    public class TipoImpuestoController : Controller
    {
        private readonly IConfiguration _configuration;

        // GET: TipoImpuesto
        GenericResponse _gr = new();
        private TipoImpuestoRentaDao _ti;
        public TipoImpuestoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ti = new TipoImpuestoRentaDao(_configuration);
        }
        
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TipoImpuestoRenta data)
        {
            _gr = await _ti.InsertAsync(data);
            return Ok(_gr);
        }
        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ti.GetAsync(idRol, pageIndex, pageSize);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put(int idTipoImpuestoRenta, [FromBody] TipoImpuestoRenta data)
        {
            _gr = await _ti.UpdateAsync(idTipoImpuestoRenta, data);
            return Ok(_gr);
        }

        public async Task<IActionResult> Delete(int idTipoImpuestoRenta)
        {
            _gr = await _ti.DeleteAsync(idTipoImpuestoRenta);
            return Ok(_gr);
        }

        public async Task<IActionResult> OptionTipoImpuesto(int idConfiguracionContribuyente)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ti.OptionAsync(idRol, idConfiguracionContribuyente);
            return Ok(_gr);
        }
    }
}