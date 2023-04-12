using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.FE
{
    public class ConfigComprobElectController : Controller
    {
        private readonly IConfiguration _configuration;
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        
        GenericResponse _gr = new();

        public ConfigComprobElectController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            
            

        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id,[FromBody] ConfigComprobElect data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("codigoPorcentaje", data.codigoPorcentaje);
            parameters.Add("porcentaje", data.porcentaje);
            parameters.Add("isAutomatic", data.isAutomatic);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("FactElect.Config_Comprob_Elect_Update", parameters)));

        }
    }
}
