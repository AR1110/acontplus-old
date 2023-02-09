using DataAccess.Tesoreria;
using Domain.Models.Tesoreria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.GestionFinanciera
{
    public class SubEntidadFinancieraController : Controller
    {

        SubEntidadFinancieraDao _sef = new();
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SubEntidadFinanciera data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _sef.InsertAsync(idRol, data);
            return Ok(res);
        }

        public async Task<IActionResult> Get(int pageIndex, int pageSize)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _sef.GetAsync(idRol, pageIndex, pageSize);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put(int idSubEntidadFinanciera, [FromBody] SubEntidadFinanciera data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _sef.UpdateAsync(idRol, idSubEntidadFinanciera, data);
            return Ok(res);
        }

        public async Task<IActionResult> Delete(int idSubEntidadFinanciera)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _sef.DeleteAsync(idRol, idSubEntidadFinanciera);
            return Ok(res);
        }


        //Get by idEntidadFinanciera 
        public async Task<IActionResult> GetByIdEntidadFinanciera(int idEntidadFinanciera)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _sef.GetByEnFinacieraAsync(idRol, idEntidadFinanciera);
            return Ok(res);
        }
    }
}
