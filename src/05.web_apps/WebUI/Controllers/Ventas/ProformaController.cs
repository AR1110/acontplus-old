using DataAccess.Ventas;
using Domain.Models;
using Domain.ViewModels.Ventas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Helpers;
using DataAccess;

namespace WebUI.Controllers.Ventas
{
    public class ProformaController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        private ProformaDao _prof;

        public ProformaController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _prof = new ProformaDao(_configuration);
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
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Ventas.Proforma_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Ventas.Proforma_GetId", parameters)));

        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ProformaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _prof.InsertAsync(idRol, data);
            return Ok(res);

        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] ProformaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _prof.UpdateAsync(idRol, id, data);
            return Ok(res);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.Proforma_Delete", parameters)));

        }
    }
}
