using DataAccess;
using DataAccess.GestionFinanciera;
using Domain.Models;
using Domain.Models.GestionFinanciera;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionFinanciera
{
    public class MovimientoCajaController : Controller
    {
        private readonly IConfiguration _configuration;
        
        private DataAccessObject _dao;
        

        private MovimientoCajaDao _movc;

        public MovimientoCajaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            
            _movc = new MovimientoCajaDao(_configuration); 
            
        }

        
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] MovimientoCaja data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _movc.InsertAsync(idRol, data);
            return Ok(res);
        }

      

        public async Task<IActionResult> Get(string json) 
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _movc.GetAsync(idRol, json);
            return Ok(res);

        }


        public async Task<IActionResult> GetMoneda(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("ReporteIngresos.Ingreso_Egreso_Caja", parameters)));
        }

        public async Task<IActionResult> Report(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("ReporteIngresos.Ingreso_Egreso_Caja", parameters)));            
        }
        

    }
}
