using Common.Core.Models;
using Common.Infrastructure.Repository.GestionFinanciera;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Financiero
{
    public class CarteraProveedorController : Controller
    {
        GenericResponse _gr = new();
        private CarteraDao _c;
        private readonly IConfiguration _configuration;
        public CarteraProveedorController(IConfiguration configuration)
        {
            _configuration = configuration;
            _c = new CarteraDao(_configuration);
        }

        public IActionResult Index() => View();

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _c.GetEgresosAsync(idRol, json);
            return Ok(res);
        }
    }
}
