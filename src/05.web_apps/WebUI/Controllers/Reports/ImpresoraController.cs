using DataAccess;
using Helpers;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebUI.ApiClient;

namespace WebUI.Controllers.Reports
{
    
    public class ImpresoraController : Controller
    {
        private IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private string _connectionStrings;
        private DataAccessObject _dao;
        private readonly int _idRol;
        public ImpresoraController(IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _config = config;
            _connectionStrings = _config.GetSection("ConnectionStrings").GetSection("AcontPlus").Value;
            _dao = new DataAccessObject(_config);
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
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("ApiPrinter.Impresora_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetDataForm(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("ApiPrinter.Impresora_Get_Data_Form", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("ApiPrinter.Impresora_Get_Id", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("ApiPrinter.Impresora_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("ApiPrinter.Impresora_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("ApiPrinter.Impresora_Delete", parameters)));
        }
        [HttpPost]
        public async Task<IActionResult> PostService(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("ApiPrinter.Service_Print_Insert", parameters)));
        }
        public async Task<IActionResult> Load()
        {
            var _response = await new ApiServer(_config.GetSection("UrlApis").GetSection("UrlApiPrint").Value).GetAsync<GenericResponse>("api/Imprimir/GetPrinters");
            return Ok(_response);
        }
    }
}
