using Common.Core.Models.GestionFinanciera;
using DataAccess.GestionFinanciera;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Financiero
{
    public class AnticipoController : Controller
    {
        private AnticipoDao _a;
        private readonly IConfiguration _configuration;
        public AnticipoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _a = new AnticipoDao(_configuration);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] Anticipo data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _a.InsertAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> Get(string json)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _a.GetAsycn(idRol, json);
            return Ok(res);
        }
    }
}
