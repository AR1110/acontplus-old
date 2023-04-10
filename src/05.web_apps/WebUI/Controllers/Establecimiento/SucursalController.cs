using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Helpers;

namespace WebUI.Controllers.Establecimiento
{
    public class SucursalController : Controller
    {
        // GET: Sucursal
        // private readonly IConfiguration _configuration;
        private readonly IConfiguration _configuration;
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        
        GenericResponse _gr = new();
        
        public SucursalController(IConfiguration configuration)
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
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Establecimientos.Sucursal_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Establecimientos.Sucursal_Get_Id", parameters)));
        }

        //Gestion de Información
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Sucursal data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("nombreComercial", data.nombreComercial);
            parameters.Add("serie", data.serie );
            parameters.Add("direccion", data.direccion ?? "");
            parameters.Add("telefono", data.telefono ?? "");
            parameters.Add("email", data.email ?? "");
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Establecimientos.Sucursal_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] Sucursal data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("nombreComercial", data.nombreComercial);
            parameters.Add("serie", data.serie);
            parameters.Add("direccion", data.direccion ?? "");
            parameters.Add("telefono", data.telefono ?? "");
            parameters.Add("email", data.email ?? "");
            parameters.Add("estado", data.estado);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Establecimientos.Sucursal_Update", parameters)));
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Establecimientos.Sucursal_Delete", parameters)));
        }

    }
}