using DataAccess.Logistica;
using Domain.Models;
using Domain.ViewModels.Logistica;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DataAccess;
using Helpers;

namespace WebUI.Controllers.Logistica
{
    public class GuiaRemisionController : Controller
    {
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        
        private GenericResponse _gr = new();
        private GuiaRemisionDao _guideR;
        private IConfiguration _config;

                
        public GuiaRemisionController(IConfiguration configuration)
        {
            _config = configuration;
            _dao = new DataAccessObject(_config);
            _guideR = new GuiaRemisionDao(_config);
            
                        
        }


        
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {            
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Logistica.GuiaRemision_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Logistica.GuiaRemision_Get_Id", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] GuiaRemisionViewModel data)
        {
            var res = await _guideR.InsertAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), data);
            return Ok(res);
        }
        
        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] GuiaRemisionViewModel data)
        {
            _gr = await _guideR.UpdateAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), id, data);
            return Ok(_gr);
        }
         
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)  
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Logistica.GuiaRemision_Delete", parameters)));
        }
    }
}
