using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Almacen;
using DataAccess;
using Helpers;

namespace WebUI.Controllers
{
    public class MarcaController : Controller
    {
        // GET: Marca
        private readonly IConfiguration _configuration;
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        
        GenericResponse _gr = new();
        private MarcaDao _m;

        public MarcaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _m = new MarcaDao(_configuration);
            
            
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
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Almacen.Marca_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Marca data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("descripcion", data.descripcion);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Marca_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] Marca data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("estado", data.estado);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Marca_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Marca_Delete", parameters)));
        }

        //Operaciones Especiales 

        public async Task<IActionResult> ListMarca(int idMarca)
        {
            _gr = await _m.OptionAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), idMarca);
            return Ok(_gr);
        }

    }
}