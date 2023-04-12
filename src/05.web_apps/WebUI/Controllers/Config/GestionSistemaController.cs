using DataAccess.Almacen;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Helpers;

namespace WebUI.Controllers.Config
{
    public class GestionSistemaController : Controller
    {
        // GET: Articulo
        private readonly IConfiguration _configuration;
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        
        GenericResponse _gr = new();
        private ArticuloDao _a;

        public GestionSistemaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _a = new ArticuloDao(_configuration);
            
            
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Config.GestionSistema_Get", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] GestionSistema data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("idTipoIva", data.idTipoIva);
            parameters.Add("idCliente", data.idCliente);
            parameters.Add("idArticulo", data.idArticulo);
            parameters.Add("idMetodoValoracion", data.idMetodoValoracion);
            parameters.Add("llevaInventario", data.llevaInventario);
            parameters.Add("searchCode", data.searchCode);
            parameters.Add("printerAutomatic", data.printerAutomatic);
            parameters.Add("payAutomatic", data.payAutomatic);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.GestionSistema_Update", parameters)));
        }
    }

}
