using Helpers;
using DataAccess;
using Domain.Models.Inventario;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Models;

namespace WebUI.Controllers.Inventario
{
    public class TransferenciaBodegaController : Controller
    {
        // GET: Articulo
        private readonly IConfiguration _configuration;
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        

        public TransferenciaBodegaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            
            

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
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Inventario.TransferenciaBodega_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Inventario.TransferenciaBodega_Get_Id", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] TransferenciaBodegaParams data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("jsonHeader", data.header);
            parameters.Add("jsonDetalle", data.detail);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Inventario.TransferenciaBodega_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] TransferenciaBodegaParams data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("jsonHeader", data.header);
            parameters.Add("jsonDetalle", data.detail);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Inventario.TransferenciaBodega_Update", parameters)));
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Inventario.TransferenciaBodega_Delete", parameters)));
        }
    }
}
