using DataAccess.Logistica;
using Domain.Models.Logistica;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Logistica
{
    public class TransportistaController : Controller
    {
        TransportistaDao _trans = new();
        public ViewResult Index()
        {
            return View();
        }

        /*
         const json = {
            typeList: 0, --Lista Normal 
            typeList: 1 => Para lISTAR EN SELECT HTML
            typeList: 2 => Para buscadores(autocomplete)
        }
         */
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _trans.GetAsync(idRol, json);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Transportista data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _trans.InsertAsync(idRol, data);
            return Ok(res);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] Transportista data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _trans.PutAsycn(idRol, id, data);
            return Ok(res);

        }

        public async Task<IActionResult> Delete(int id)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _trans.DeleteAsync(idRol, id);
            return Ok(res);
        }      
    }
}
