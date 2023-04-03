using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Almacen;
using Domain.ViewModels;
using DataAccess;
using Newtonsoft.Json;

namespace WebUI.Controllers
{
    public class ArticuloFraccionadoController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        readonly ArticuloFraccionadoDao _af;

        public ArticuloFraccionadoController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _af = new ArticuloFraccionadoDao(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        }

        
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", json);
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Almacen.Fraccionado_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            var res = await _af.GetIdAsync(id);
            return Ok(res);
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ArticuloFraccionadoViewModel data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("idArticulo", data.fraccionado.idArticulo);
            parameters.Add("idMedida", data.fraccionado.idMedida);
            parameters.Add("conversion", data.fraccionado.conversion);
            parameters.Add("gestionVenta", data.fraccionado.gestionVenta);
            parameters.Add("precioCostoFraccionado", data.fraccionado.precioCostoFraccionado);
            parameters.Add("json", JsonConvert.SerializeObject(data.pvps));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Fraccionado_Insert", parameters)));
        }


        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] ArticuloFraccionadoViewModel data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            parameters.Add("idMedida", data.fraccionado.idMedida);
            parameters.Add("conversion", data.fraccionado.conversion);
            parameters.Add("gestionVenta", data.fraccionado.gestionVenta);
            parameters.Add("precioCostoFraccionado", data.fraccionado.precioCostoFraccionado);
            parameters.Add("estado", data.fraccionado.estado);
            parameters.Add("json", JsonConvert.SerializeObject(data.pvps));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Fraccionado_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Fraccionado_Delete", parameters)));
        }

    }
}