using DataAccess.GestionFinanciera;
using Domain.Models.GestionFinanciera;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionFinanciera
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
        [Authorize]
        public IActionResult Index() 
        {
            return View(); 
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] Anticipo data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _a.InsertAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _a.GetAsycn(idRol, json);
            return Ok(res);
        }
    }
}
