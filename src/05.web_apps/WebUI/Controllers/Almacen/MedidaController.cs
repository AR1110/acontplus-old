using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using DataAccess.Almacen;
using Domain.Models.Almacen;
using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Helpers;

namespace WebUI.Controllers
{
    public class MedidaController : Controller
    {
        // GET: Medida
        private readonly IConfiguration _configuration;
        
        private DataAccessObject _dao;
        GenericResponse _gr = new();
        private MedidaDao _m;

        public MedidaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _m = new MedidaDao(_configuration);
        }
        
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Almacen.Medida_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Medida data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("descripcion", data.descripcion);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Medida_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] Medida data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("id", id);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("estado", data.estado);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Medida_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Medida_Delete", parameters)));
        }
        
        //Get By Medida
        public async Task<IActionResult> GetByMedida()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _m.GetByMedida(idRol);
            return Ok(res);
        }
    }
}