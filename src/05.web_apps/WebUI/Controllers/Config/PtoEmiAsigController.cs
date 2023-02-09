using DataAccess;
using DataAccess.Config;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Config
{
    public class PtoEmiAsigController : Controller
    {
        // GET: Establecimiento
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;

        public PtoEmiAsigController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);

        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Config.PtoEmi_Asig_Get", parameters)));
        }


        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] PtoEmiAsig data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", data.idPtoEmi_Asig);
            parameters.Add("codEstab_Asig", data.codEstab_Asig);
            parameters.Add("idPuntoEmision", data.idPuntoEmision);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.PtoEmi_Asig_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            parameters.Add("predeterminado", true);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.PtoEmi_Asig_Update", parameters)));
        }
    }
}
