using DataAccess;
using DataAccess.GestionFinanciera;
using Domain.Models.GestionFinanciera;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace WebUI.Controllers.GestionFinanciera
{
    public class MovimientoCajaController : Controller
    {
        private readonly IConfiguration _configuration;

        private MovimientoCajaDao _movc;
        private readonly LogWriter _log;
        public MovimientoCajaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _movc = new MovimientoCajaDao(_configuration);
            _log = log;
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
            DbAccess _db = new DbAccess(_configuration);
            
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("ReporteIngresos.Ingreso_Egreso_Caja");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in GetMoneda: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        public async Task<IActionResult> Report(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("ReporteIngresos.Ingreso_Egreso_Caja");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Report: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
