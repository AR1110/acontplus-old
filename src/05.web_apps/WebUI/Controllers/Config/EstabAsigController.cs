using DataAccess;
using DataAccess.Config;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Config
{
    public class EstabAsigController : Controller
    {
        // GET: Establecimiento
        private readonly IConfiguration _configuration;
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        

        public EstabAsigController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            
            

        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Config.Estab_Asig_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetDataForm(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Config.Estab_Asig_Get_Data_Form", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] EstabAsig data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", data.idEstab_Asig);
            parameters.Add("idUsuarioRol", data.idUsuarioRol);
            parameters.Add("codEstab", data.codEstab);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.Estab_Asig_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.Estab_Asig_Update", parameters)));
        }

    }
}

