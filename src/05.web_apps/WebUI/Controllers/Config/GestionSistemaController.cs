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
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        GenericResponse _gr = new();
        private ArticuloDao _a;

        public GestionSistemaController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _a = new ArticuloDao(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Config.GestionSistema_Get", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] GestionSistema data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            parameters.Add("idTipoIva", data.idTipoIva);
            parameters.Add("idCliente", data.idCliente);
            parameters.Add("idArticulo", data.idArticulo);
            parameters.Add("idMetodoValoracion", data.idMetodoValoracion);
            parameters.Add("llevaInventario", data.llevaInventario);
            parameters.Add("searchCode", data.searchCode);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.GestionSistema_Update", parameters)));
        }
    }

}
