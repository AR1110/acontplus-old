using DataAccess;
using DataAccess.Ventas;
using Domain.Models;
using Domain.ViewModels.Ventas;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Ventas
{
    public class RetencionVentaController : Controller
    {
        private readonly IConfiguration _configuration;        
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        
        GenericResponse _gr = new();

        private RetencionVentaDao _rv;
        public RetencionVentaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _rv = new RetencionVentaDao(_configuration);            
            _dao = new DataAccessObject(_configuration);
            
            
        }

         
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RetencionVentaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _rv.InsertAsync(idRol, data);
            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _rv.GetAsync(idRol, json);
            return Ok(res);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int idRetencionVenta, [FromBody] RetencionVentaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _rv.UpdateAsync(idRol, idRetencionVenta, data);
            return Ok(res);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _rv.DeleteAsync(idRol, id);
            return Ok(res);

        }


        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Ventas.Retencion_Get_Id", parameters)));      
        }
    }
}
