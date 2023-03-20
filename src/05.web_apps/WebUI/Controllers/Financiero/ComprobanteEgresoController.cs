using Helpers;
using DataAccess;
using DataAccess.GestionFinanciera;
using DataAccess.Tesoreria;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Domain.Dtos.Contabilidad;

namespace WebUI.Controllers.GestionFinanciera
{
    public class ComprobanteEgresoController : Controller
    {
        private ComprobanteIngresoDao _ci;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private DataAccessObject _dao;
        private readonly int _idRol;
        private EstadoFinancieroDao _ef;

        public ComprobanteEgresoController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _ef = new EstadoFinancieroDao(_configuration);
            _ci = new ComprobanteIngresoDao(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }


        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {

            GenericResponse _response = new GenericResponse();
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idUsuarioRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            _response = DbResponse.SPDataTable(await _dao.GetDataTableAsync("GestFinanc.ComprobanteEgreso_Get", parameters));
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post( [FromBody] PagoDto data)
        {
            GenericResponse _response = new GenericResponse();
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idUsuarioRol", _idRol);
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
            parameters.Add("idUsuarioRol", _idRol);
            parameters.Add("idComprobanteEgreso", id);
            parameters.Add("observacion", observacion);
            _response = DbResponse.SPDefault(await _dao.GetDataTableAsync("GestFinanc.ComprobanteEgreso_Update_Cancel", parameters));
            return Ok(_response);
        }
    }
}
