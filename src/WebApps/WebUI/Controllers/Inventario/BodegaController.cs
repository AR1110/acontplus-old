using DataAccess;
using Domain.Models;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Inventario
{
    public class BodegaController : Controller
    {
        // GET: Bodega
        // // GET: Articulo
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        GenericResponse _gr = new();

        public BodegaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);



        }


        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Inventario.Bodega_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] Bodega data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("codEstab", data.codEstab);
            parameters.Add("descripcion", data.descripcion ?? "");
            parameters.Add("telefono", data.telefono ?? "");
            parameters.Add("direccion", data.direccion ?? "");
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Inventario.Bodega_Insert", parameters)));
        }



        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] Bodega data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("descripcion", data.descripcion ?? "");
            parameters.Add("telefono", data.telefono ?? "");
            parameters.Add("direccion", data.direccion ?? "");
            parameters.Add("estado", data.estado);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Inventario.Bodega_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Inventario.Bodega_Delete", parameters)));
        }

    }
}