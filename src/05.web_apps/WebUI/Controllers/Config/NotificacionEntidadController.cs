using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Config
{
    public class NotificacionEntidadController : Controller
    {
        private readonly IConfiguration _configuration;
        
        private DataAccessObject _dao;

        public NotificacionEntidadController(IConfiguration configuration)
        {
            _configuration = configuration;
            
            _dao = new DataAccessObject(_configuration);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Config.EntidadNotificacion_Get", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.EntidadNotificacion_Update", parameters)));
        }
    }
}
