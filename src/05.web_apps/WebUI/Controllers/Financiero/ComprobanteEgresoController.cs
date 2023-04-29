using DataAccess;
using DataAccess.Tesoreria;
using Domain.Dtos.Contabilidad;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionFinanciera
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

            GenericResponse _response = new GenericResponse();
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            _response = DbResponse.SPDataTable(await _dao.GetDataTableAsync("GestFinanc.ComprobanteEgreso_Get", parameters));
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PagoDto data)
        {
            GenericResponse _response = new GenericResponse();
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("comprobante", SqlValidation.ValidateSqlString(data.comprobante));
            parameters.Add("pagos", SqlValidation.ValidateSqlString(data.pago));
            parameters.Add("pagoDetalle", SqlValidation.ValidateSqlString(data.pagoDetalle));
            parameters.Add("historial", SqlValidation.ValidateSqlString(data.historial));
            _response = DbResponse.SPDefault(await _dao.GetDataTableAsync("GestFinanc.ComprobanteEgreso_Insert", parameters));
            return Ok(_response);
        }

        public async Task<IActionResult> Cancel(int id, string observacion)
        {
            GenericResponse _response = new GenericResponse();
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("idComprobanteEgreso", id);
            parameters.Add("observacion", observacion);
            _response = DbResponse.SPDefault(await _dao.GetDataTableAsync("GestFinanc.ComprobanteEgreso_Update_Cancel", parameters));
            return Ok(_response);
        }
    }
}
