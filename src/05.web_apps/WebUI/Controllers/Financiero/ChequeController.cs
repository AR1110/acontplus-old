using DataAccess.GestionFinanciera;
using Domain.Models.GestionFinanciera;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.GestionFinanciera
{
    public class ChequeController : Controller
    {
        ChequeDao _c = new();
        [Authorize]
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
