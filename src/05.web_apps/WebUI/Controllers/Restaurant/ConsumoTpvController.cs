using Helpers;
using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Models;

namespace WebUI.Controllers.Restaurant
{
    [Authorize]
    public class ConsumoTpvController : Controller
    {
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _environment;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly int _idRol;
        private readonly string _urlApiReports = string.Empty;
        private readonly string _urlPrint = string.Empty;
        public ConsumoTpvController(IConfiguration config,
            IWebHostEnvironment environment,
                                    IHttpContextAccessor httpContextAccessor)
        {
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _environment = environment;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _urlApiReports = _config.GetSection("UrlApis").GetSection("AcontPlusApi").Value;
            _urlPrint = _config.GetSection("UrlApis").GetSection("UrlApiPrint").Value;
        }
        public IActionResult Index()
        {
            ViewData["urlReports"] = _urlApiReports;
            ViewData["_urlPrint"] = _urlPrint;
            return View();
        }
        public IActionResult Report()
        {
            ViewData["urlReports"] = _urlApiReports;
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            DataAccessObject _dao = new DataAccessObject(_config);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Restaurant.ConsumoTpv_Get", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            DataAccessObject _dao = new DataAccessObject(_config);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.ExecTranAsync("Restaurant.ConsumoTpv_Insert", parameters)));
        }
        [HttpPut]
        public async Task<IActionResult> Put(string json)
        {
            DataAccessObject _dao = new DataAccessObject(_config);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.ExecTranAsync("Restaurant.ConsumoTpv_Update", parameters)));
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            DataAccessObject _dao = new DataAccessObject(_config);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.ExecTranAsync("Restaurant.ConsumoTpv_Delete", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> Print(int id)
        {
            DataAccessObject _dao = new DataAccessObject(_config);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.ExecTranAsync("Restaurant.ConsumoTpv_Print", parameters)));
        }
    }
}
