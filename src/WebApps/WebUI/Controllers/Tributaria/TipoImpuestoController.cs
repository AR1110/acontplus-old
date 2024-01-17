using Common.Core.Models;
using Common.Core.Models.GestionTributaria;
using Common.Infrastructure.Repository.GestionTributaria;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Tributaria
{
    public class TipoImpuestoController : Controller
    {
        private readonly IConfiguration _configuration;

        // GET: TipoImpuesto
        ApiResponse _gr = new();
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
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
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
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _ti.OptionAsync(idRol, idConfiguracionContribuyente);
            return Ok(_gr);
        }
    }
}
