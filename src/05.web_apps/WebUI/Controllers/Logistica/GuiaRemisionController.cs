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
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        private GenericResponse _gr = new();
        private GuiaRemisionDao _guideR;
        private IConfiguration _config;

                
        public GuiaRemisionController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _config = configuration;
            _dao = new DataAccessObject(_config);
            _guideR = new GuiaRemisionDao(_config);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);            
        }


        
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
            var res = await _guideR.InsertAsync(_idRol, data);
            return Ok(res);
        }
        
        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] GuiaRemisionViewModel data)
        {
            _gr = await _guideR.UpdateAsync(_idRol, id, data);
            return Ok(_gr);
        }
         
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)  
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Logistica.GuiaRemision_Delete", parameters)));
        }
    }
}
