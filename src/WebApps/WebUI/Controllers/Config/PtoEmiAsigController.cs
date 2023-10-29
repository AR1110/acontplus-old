using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Domain.Models;
using Domain.Models.Config;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace WebUI.Controllers.Config
{
    public class PtoEmiAsigController : Controller
    {
        // GET: Establecimiento
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;


        public PtoEmiAsigController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);



        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Config.PtoEmi_Asig_Get");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    response = _db.GetDataTableAsync();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] PtoEmiAsig data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", data.idPtoEmi_Asig);
            parameters.Add("codEstab_Asig", data.codEstab_Asig);
            parameters.Add("idPuntoEmision", data.idPuntoEmision);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.PtoEmi_Asig_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("predeterminado", true);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.PtoEmi_Asig_Update", parameters)));
        }
    }
}
