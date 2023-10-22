using DataAccess;
using DataAccess.GestionFinanciera;
using Domain.Dtos.Contabilidad;
using Domain.Models;
using Lib.Common.Api;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Financiero
{
    public class ComprobanteEgresoController : Controller
    {
        private ComprobanteIngresoDao _ci;
        private readonly IConfiguration _configuration;

        private DataAccessObject _dao;

        private EstadoFinancieroDao _ef;

        public ComprobanteEgresoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _ef = new EstadoFinancieroDao(_configuration);
            _ci = new ComprobanteIngresoDao(_configuration);


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
            _response = DbResponse.SPDataTable(await _dao.GetDataTableAsync("GestFinanc.ComprobanteEgreso_Get", parameters));
            return Ok(_response);
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
