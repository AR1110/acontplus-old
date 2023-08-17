using DataAccess;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class TipoPersonaController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TipoPersonaDao _tp;

        public TipoPersonaController(IConfiguration config)
        {
            _config = config;
            _tp = new TipoPersonaDao(_config);
        }


        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> ReadTipoPersona()
        {
            _gr = await _tp.ReadTipoPersonaAsync();
            return Ok(_gr);
        }
    }
}
