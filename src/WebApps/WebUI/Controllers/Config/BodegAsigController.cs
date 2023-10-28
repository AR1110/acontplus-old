using Common.Core.Utils;
using DataAccess;
using Domain.Models;
using Domain.Models.Config;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Config
{
    public class BodegAsigController : Controller
    {
        // GET: Establecimiento
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;


        public BodegAsigController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);



        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlStringParam.Sanitize(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Config.Bodeg_Asig_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] BodegAsig data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", data.idBodeg_Asig);
            parameters.Add("codEstab_Asig", data.codEstab_Asig);
            parameters.Add("idBodega", data.idBodega);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.Bodeg_Asig_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("predeterminado", true);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.Bodeg_Asig_Update", parameters)));
        }
    }
}
