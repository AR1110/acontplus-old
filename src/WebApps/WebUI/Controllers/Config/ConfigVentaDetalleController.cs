using DataAccess;
using Domain.Models;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Config
{
    public class ConfigVentaDetalleController : Controller
    {
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        public ConfigVentaDetalleController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);


        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlStringParam.Sanitize(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("ASPConfigVentaDetalleGet", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(string json)
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlStringParam.Sanitize(json));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("ASPConfigVentaDetalleUpdate", parameters)));
        }
    }
}
