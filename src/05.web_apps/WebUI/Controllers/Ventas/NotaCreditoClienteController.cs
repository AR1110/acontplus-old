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
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao; 
        private readonly int _idRol;

        public NotaCreditoClienteController(IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _config = config;
            _dao = new DataAccessObject(_config);
            _nc = new NotaCreditoDao(_config);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);           
        }

        [Authorize]
        public IActionResult Index()
        {
            ViewData["idRol"] = _idRol;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] NotaCreditoViewModel data)
        {            
            _gr = await _nc.InsertAsync(_idRol, data);
            return Ok(_gr);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {            
            var res = await _nc.GetAsync(_idRol, json);
            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Ventas.NotaCredito_Get_Id", parameters)));                        

        }

        [HttpPut]
        public async Task<IActionResult> Update(long id, [FromBody] NotaCreditoViewModel data)
        {            
            _gr = await _nc.UpdateAsync(_idRol, id, data);
            return Ok(_gr);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id) => Ok(await _nc.DeleteAsync(_idRol, id));
    }
}
