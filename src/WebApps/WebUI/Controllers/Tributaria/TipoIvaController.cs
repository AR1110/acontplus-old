using Common.Core.Models;
using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Tributaria
{
    public class TipoIvaController : Controller
    {
        // GET: Iva
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TipoIvaDao _ti;

        public TipoIvaController(IConfiguration config)
        {
            _config = config;
            _ti = new TipoIvaDao(_config);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TipoIva data)
        {
            var res = await _ti.CreateTipoIvaAsync(data);
            return Ok(res);
        }
        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            var res = await _ti.ReadTipoIvaAsync(pageIndex, pageSize);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] TipoIva data)
        {
            var res = await _ti.UpdateTipoIvaAsync(data);
            return Ok(res);
        }


        public async Task<IActionResult> Delete(int idTipoIva)
        {
            var res = await _ti.DeleteTipoIvaAsync(idTipoIva);
            return Ok(res);
        }

        //Operaciones Especiales 
        public async Task<IActionResult> OptionTipoIva()
        {
            var res = await _ti.OptionTipoIvaAsync();
            return Ok(res);
        }
    }
}