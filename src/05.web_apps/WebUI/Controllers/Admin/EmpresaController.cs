using DataAccess.Administracion;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class EmpresaController : Controller
    {
        private readonly IConfiguration _config;
        private EmpresaDao _e;
        public EmpresaController(IConfiguration config)
        {
            _config = config;
            _e = new EmpresaDao(_config);
        }
        
        public IActionResult Index()
        {
            return View();
        } 

        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _e.GetAsync(idRol, json);
            return Ok(res);
        }

        public async Task<IActionResult> Post([FromBody] Empresa data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _e.InsertAsync(idRol, data));
        }

        public async Task<IActionResult> Put(int id, [FromBody] Empresa data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _e.UpdateAsync(idRol, id, data));
        }

        public async Task<IActionResult> Delete(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _e.DeleteAsync(idRol, id));
        }


    }
}
