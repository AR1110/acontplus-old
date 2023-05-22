using DataAccess.GestionFinanciera;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionFinanciera
{
    public class CarteraClienteController : Controller
    {
        private readonly IConfiguration _configuration;

        GenericResponse _gr = new();
        private CarteraDao _c;
        public CarteraClienteController(IConfiguration configuration)
        {
            _configuration = configuration;
            _c = new CarteraDao(_configuration);
        }


        public IActionResult Index() => View();

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _c.GetIngresosAsync(idRol, json);
            return Ok(res);
        }
    }
}
