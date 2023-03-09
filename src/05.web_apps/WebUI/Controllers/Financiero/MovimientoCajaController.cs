using DataAccess;
using DataAccess.GestionFinanciera;
using Domain.Models;
using Domain.Models.GestionFinanciera;
using Domain.ViewModels;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.GestionFinanciera
{
    public class MovimientoCajaController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private DataAccessObject _dao;
        private readonly int _idRol;
        private readonly string _urlApiReports = string.Empty;
        private readonly string _urlPrint = string.Empty;

        private MovimientoCajaDao _movc;

        public MovimientoCajaController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _movc = new MovimientoCajaDao(_configuration); 
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _urlApiReports = _configuration.GetSection("UrlApis").GetSection("AcontPlusApi").Value;
            _urlPrint = _configuration.GetSection("UrlApis").GetSection("UrlApiPrint").Value;
        }

        [Authorize]
        public IActionResult Index()
        {
            ViewData["urlReports"] = _urlApiReports;
            ViewData["_urlPrint"] = _urlPrint;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] MovimientoCaja data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _movc.InsertAsync(idRol, data);
            return Ok(res);
        }

      

        public async Task<IActionResult> Get(string json) 
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _movc.GetAsync(idRol, json);
            return Ok(res);

        }


        public async Task<IActionResult> GetMoneda(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("ReporteIngresos.Ingreso_Egreso_Caja", parameters)));
        }

        public async Task<IActionResult> Report(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("ReporteIngresos.Ingreso_Egreso_Caja", parameters)));            
        }
        

    }
}
