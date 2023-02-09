using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Almacen;
using Domain.Models.Almacen;
using Helpers;

namespace WebUI.Controllers
{
    public class SubFamiliaController : Controller
    {
        //// GET: SubFamilia
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        GenericResponse _gr = new();
        readonly SubFamiliaDao _sf = new();

        public SubFamiliaController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);

        }

        [Authorize]
        public IActionResult Index()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            ViewBag.idRol = idRol;
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Almacen.SubFamilia_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SubFamilia data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("idFamilia", data.idFamilia);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("siglas", data.siglas);
            parameters.Add("montoObjetivo", data.montoObjetivo);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.SubFamilia_Insert", parameters)));
        }
       
        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] SubFamilia data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            parameters.Add("idFamilia", data.idFamilia);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("montoObjetivo", data.montoObjetivo);
            parameters.Add("estado", data.estado);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.SubFamilia_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.SubFamilia_Delete", parameters)));
        }

        //DEPURACION        
        public async Task<IActionResult> GetBy()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _sf.OptionAsync(idRol);
            return Ok(_gr);
        }
    }
}