using DataAccess;
using Domain.Models;
using Domain.Models.Sri;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace WebUI.Controllers.Sri
{
    public class EstablecimientoController : Controller
    {
        // GET: Establecimiento
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;

        public EstablecimientoController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);

        }
        
        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Sri.Establecimiento_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();            
            parameters.Add("json", json);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Sri.Establecimiento_Get_Id", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetDataForm()
        {
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Sri.Establecimiento_Get_Data_Form")));
        }

        [HttpPost]
        public async Task<IActionResult> Insert(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", json);            
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Sri.Establecimiento_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id,string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            parameters.Add("json", json);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Sri.Establecimiento_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Sri.Establecimiento_Delete", parameters)));
        }
    }
}
