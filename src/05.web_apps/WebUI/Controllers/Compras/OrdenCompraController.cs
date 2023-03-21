using WebUI.ApiClient;
using DataAccess.Compras;
using Domain.Models;
using Domain.ViewModels.Compras;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DataAccess;
using Helpers;

namespace WebUI.Controllers.Compras
{
    public class OrdenCompraController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        GenericResponse _gr = new();
        private OrdenCompraDao _oc;

        public OrdenCompraController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _oc = new OrdenCompraDao(_configuration);
            _oc = new OrdenCompraDao(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        }

        [Authorize]
        public IActionResult Index()
        {
            ViewData["idRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] OrdenCompraViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _oc.InsertAsync(idRol, data);
            return Ok(res);
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _oc.GetAsync(idRol, json);
            return Ok(res);
        }
        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Compra.Orden_Get_Id", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] OrdenCompraViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _oc.UpdateAsync(idRol, id, data);
            return Ok(res);
        }


        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Compra.Orden_Delete", parameters)));
        }
    }
}
