using DataAccess.GestionFinanciera;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionFinanciera
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
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _c.GetEgresosAsync(idRol, json);
            return Ok(res);
        } 
    }
}
