using DataAccess;
using Domain.Models;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class ControlCajaController : Controller
    {
        // GET: Articulo
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        GenericResponse _gr = new();

        public ControlCajaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);


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
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Administrador.ControlCaja_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] ControlCaja data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("idCaja", data.idCaja);
            parameters.Add("idEntidadFinanciera", data.idEntidadFinanciera);
            parameters.Add("concepto", data.concepto ?? "");
            parameters.Add("entrada", data.entrada);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Administrador.ControlCaja_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] ControlCaja data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("id", id);
            parameters.Add("spParams", data.spParams);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Administrador.ControlCaja_Update", parameters)));
        }


        [HttpGet]
        public async Task<IActionResult> GetArqueoCaja(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Administrador.DetalleArqueo_Get", parameters)));
        }
    }
}
