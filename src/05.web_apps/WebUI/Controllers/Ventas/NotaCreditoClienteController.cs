using DataAccess;
using DataAccess.Ventas;
using Domain.Dtos;
using Domain.Models;
using Domain.ViewModels.Ventas;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Ventas
{
    public class NotaCreditoClienteController : Controller
    {
        private NotaCreditoDao _nc;
        private GenericResponse _gr = new(); 
        private IConfiguration _config;
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao; 
        

        public NotaCreditoClienteController(IConfiguration config)
        {
            _config = config;
            _dao = new DataAccessObject(_config);
            _nc = new NotaCreditoDao(_config);
            
                       
        }

        
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] NotaCreditoViewModel data)
        {            
            _gr = await _nc.InsertAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), data);
            return Ok(_gr);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {            
            var res = await _nc.GetAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), json);
            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Ventas.NotaCredito_Get_Id", parameters)));                        

        }

        [HttpPut]
        public async Task<IActionResult> Update(long id, [FromBody] NotaCreditoViewModel data)
        {            
            _gr = await _nc.UpdateAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), id, data);
            return Ok(_gr);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id) => Ok(await _nc.DeleteAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), id));
    }
}
