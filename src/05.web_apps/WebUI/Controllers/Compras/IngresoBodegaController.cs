using DataAccess.Compras;
using Domain.Models;
using Domain.ViewModels.Compras;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DataAccess;
using Helpers;

namespace WebUI.Controllers.Compras
{
    public class IngresoBodegaController : Controller
    {
        private GenericResponse _gr = new();
        private LiquidacionCompraDao _lc;
        private readonly IConfiguration _configuration;
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        
        private IngresoBodegaDao _ib;

        public IngresoBodegaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _lc = new LiquidacionCompraDao(_configuration);
            _ib = new IngresoBodegaDao(_configuration);
            
            

        }
       
        
        public IActionResult Index()
        {            
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Compra.IngresoBodega_Get", parameters)));           
        }
        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Compra.IngresoBodega_Get_Id", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] IngresoBodegaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ib.InsertAsync(idRol, data);
            return Ok(res);
        }
        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] IngresoBodegaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ib.UpdateAsync(idRol, id, data);
            return Ok(res);
        }       
    }
}
