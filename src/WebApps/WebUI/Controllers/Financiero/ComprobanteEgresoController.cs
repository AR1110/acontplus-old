using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Domain.Dtos.Contabilidad;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace WebUI.Controllers.Financiero
{
    public class ComprobanteEgresoController : Controller
    {
        private readonly IConfiguration _configuration;

        private DataAccessObject _dao;

        public ComprobanteEgresoController(IConfiguration configuration)
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

            var _response = new GenericResponse();
            var parameters = new Dictionary<string, object>();
            parameters.Add("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlStringParam.Sanitize(json));
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("GestFinanc.ComprobanteEgreso_Get");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    response = _db.GetDataTableAsync();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CobroPagoDto data)
        {
            var _response = new GenericResponse();
            var parameters = new Dictionary<string, object>();
            parameters.Add("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("comprobante", SqlStringParam.Sanitize(data.comprobante));
            parameters.Add("pagos", SqlStringParam.Sanitize(data.cobrosPagos));
            parameters.Add("pagoDetalle", SqlStringParam.Sanitize(data.detalles));
            parameters.Add("historial", SqlStringParam.Sanitize(data.historial));
            _response = DbResponse.SPDefault(await _dao.GetDataTableAsync("GestFinanc.ComprobanteEgreso_Insert", parameters));
            return Ok(_response);
        }

        public async Task<IActionResult> Cancel(int id, string observacion)
        {
            var _response = new GenericResponse();
            var parameters = new Dictionary<string, object>();
            parameters.Add("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("idComprobanteEgreso", id);
            parameters.Add("observacion", observacion);
            _response = DbResponse.SPDefault(await _dao.GetDataTableAsync("GestFinanc.ComprobanteEgreso_Update_Cancel", parameters));
            return Ok(_response);
        }
    }
}
