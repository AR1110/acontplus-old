using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Domain.Models;
using Helpers;

namespace WebUI.Controllers.Sri
{
    public class PtoEmisionController : Controller
    {
        // GET: Establecimiento
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        private  TipoAmbienteDao _tipA;

        public PtoEmisionController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _tipA = new TipoAmbienteDao(_configuration);
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] PtoEmision data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("codEstab", data.codEstab);
            parameters.Add("ambiente", data.ambiente);
            parameters.Add("ptoEmi", data.ptoEmi);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Sri.PtoEmision_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] PtoEmision data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            parameters.Add("ambiente", data.ambiente);
            parameters.Add("ptoEmi", data.ptoEmi);
            parameters.Add("estado", data.estado);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Sri.PtoEmision_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Sri.PtoEmision_Delete", parameters)));
        }

        //Get Tipo Ambiente 
        public IActionResult GetTipoAmbiente()
        {
            var res = _tipA.listTipoAmbiente();
            return Ok(res);
        }
    }
}