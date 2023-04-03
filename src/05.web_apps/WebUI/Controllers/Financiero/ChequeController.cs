using DataAccess.GestionFinanciera;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionFinanciera
{
    public class ChequeController : Controller
    {
        private readonly IConfiguration _configuration;

        private ChequeDao _c;
        public ChequeController(IConfiguration configuration)
        {
            _configuration = configuration;
            _c = new ChequeDao(_configuration);
        }
        
        public IActionResult Index()
        {
            return View();
        }


        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _c.GetAsync(idRol, json);
            return Ok(res);
        }

        //public async Task<IActionResult> PutAsync(int idCobro, string observacion, bool cobro, bool anular)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var res = await _cp.UpdateAsync(idRol, idCobro, observacion, cobro, anular);
        //    return Ok(res);
        //}

    }
}
