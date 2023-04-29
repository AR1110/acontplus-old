using DataAccess;
using DataAccess.Almacen;
using Domain.Models;
using Domain.Models.Almacen;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class FamiliaController : Controller
    {
        // GET: Familia
        private readonly IConfiguration _configuration;

        private DataAccessObject _dao;
        GenericResponse _gr = new();
        private FamiliaDao _f;

        public FamiliaController(IConfiguration configuration)
        {
            _configuration = configuration;

            _dao = new DataAccessObject(_configuration);
            _f = new FamiliaDao(_configuration);
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
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Almacen.Familia_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Familia data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("siglas", data.siglas);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Familia_Insert", parameters)));

        }

        [HttpPost]
        public async Task<IActionResult> Put(int idFamilia, [FromBody] Familia data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("idFamilia", idFamilia);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("estado", data.estado);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Familia_Update", parameters)));
        }


        public async Task<IActionResult> Delete(int idFamilia)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("idFamilia", idFamilia);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Familia_Delete", parameters)));
        }

        //Operaciones Especiales 
        public async Task<IActionResult> GetBy()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _f.OptionAsync(idRol);
            return Ok(_gr);
        }

        //Creo uno nuevo metodo "GetAll" q se esta usando en uibModal SubFamilia,  
        public async Task<IActionResult> GetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _f.OptionAsync(idRol);
            return Ok(_gr);
        }
    }
}