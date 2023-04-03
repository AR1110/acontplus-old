using DataAccess;
using Helpers;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace WebUI.Controllers
{
    public class ClienteController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private DataAccessObject _dao;
        private readonly int _idRol;
        public ClienteController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        }

        
        public IActionResult Index()
        {
            return View();
        }

        public PartialViewResult MdAutocomplete()
        {
            return PartialView();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Ventas.Cliente_Get", parameters)));
        }
        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Ventas.Cliente_Get_Id", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> Search(string json)
        {
            Dictionary<string, object> parameters = new();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Ventas.Cliente_Get_Search", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Cliente data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", JsonConvert.SerializeObject(data));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.Cliente_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int idCliente, [FromBody] Cliente data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", idCliente);
            parameters.Add("json", JsonConvert.SerializeObject(data));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.Cliente_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int idCliente)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", idCliente);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.Cliente_Delete", parameters)));
        }
    }
}
