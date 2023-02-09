using DataAccess;
using Domain.Dtos;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Ventas
{
    [Authorize]
    public class RetencionAtsController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _idRol;
        public RetencionAtsController(IConfiguration configuration,
                                      IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
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
            DataAccessObject _dao = new DataAccessObject(_configuration);
            Dictionary<string, object> parameters = new Dictionary<string, object>
            {
                { "idRol", _idRol },
                { "json", SqlValidation.ValidateSqlString(json) }
            };
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("FactElect.RetencionAts_Get", parameters)));
        }
        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            DataAccessObject _dao = new DataAccessObject(_configuration);
            Dictionary<string, object> parameters = new Dictionary<string, object>
            {
                { "idRol", _idRol },
                { "id", id }
            };
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.RetencionAts_GetId", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RetencionAtsDto data)
        {
            DataAccessObject _dao = new DataAccessObject(_configuration);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("infoCompRet", SqlValidation.ValidateSqlString(data.infoCompRet));
            parameters.Add("docsSust", SqlValidation.ValidateSqlString(data.docsSust));
            parameters.Add("impuestos", SqlValidation.ValidateSqlString(data.impuestos));
            parameters.Add("retenciones", SqlValidation.ValidateSqlString(data.retenciones));
            if (!string.IsNullOrEmpty(data.reembolsos))
            {
                parameters.Add("reembolsos", SqlValidation.ValidateSqlString(data.reembolsos));
            }
            parameters.Add("payments", SqlValidation.ValidateSqlString(data.payments));
            if (!string.IsNullOrEmpty(data.infoAdicional))
            {
                parameters.Add("infoAdicional", SqlValidation.ValidateSqlString(data.infoAdicional));
            }
            return Ok(DbResponse.SPDefault(await _dao.ExecTranAsync("FactElect.RetencionAts_Insert", parameters)));
        }
        [HttpPut]
        public async Task<IActionResult> Put(int id, Dictionary<string, object> data)
        {
            DataAccessObject _dao = new DataAccessObject(_configuration);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            foreach (KeyValuePair<string, object> item in data)
            {
                parameters.Add(item.Key, SqlValidation.ValidateSqlString(item.Value.ToString()));
            }
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.RetencionAts_Update", parameters)));
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            DataAccessObject _dao = new DataAccessObject(_configuration);
            Dictionary<string, object> parameters = new Dictionary<string, object>
            {
                { "id", id },
                { "idRol", _idRol }
            };
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("FactElect.RetencionAts_Delete", parameters)));
        }
    }
}
