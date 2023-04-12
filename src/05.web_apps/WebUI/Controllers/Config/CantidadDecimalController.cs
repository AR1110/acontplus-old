using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Config
{
    public class CantidadDecimalController : Controller
    {
        private readonly IConfiguration _configuration;
        
        private DataAccessObject _dao;

        public CantidadDecimalController(IConfiguration configuration)
        {
            _configuration = configuration;
            
            _dao = new DataAccessObject(_configuration);
        }
         
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("jsonParams", json);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Config.CantidadDecimal_Get", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("jsonParams", json);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.CantidadDecimal_Update", parameters)));
        }
    }
}
