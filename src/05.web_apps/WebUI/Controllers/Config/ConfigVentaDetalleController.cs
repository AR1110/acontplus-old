using DataAccess;
using DataAccess.ConfigEmpresa;
using Domain.Models;
using Domain.Models.ConfigEmpresa;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Configuracion
{
    public class ConfigVentaDetalleController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        GenericResponse _gr = new();        

        private ConfigVentaDetalleDao _cvd;
        public ConfigVentaDetalleController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
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
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("ASPConfigVentaDetalleGet", parameters)));           
        }

        [HttpPut]
        public async Task<IActionResult> Put(string json)
        {           
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("ASPConfigVentaDetalleUpdate", parameters)));
        }
    }
}
