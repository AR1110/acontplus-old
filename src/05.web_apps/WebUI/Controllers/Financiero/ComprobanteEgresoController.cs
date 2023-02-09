using Helpers;
using DataAccess;
using DataAccess.GestionFinanciera;
using DataAccess.Tesoreria;
using Domain.Models;
using Domain.ViewModels.GestionFinanciera;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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
        private ComprobanteEgresoDao _ce;

        public ComprobanteEgresoController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _ef = new EstadoFinancieroDao(_configuration);
            _ci = new ComprobanteIngresoDao(_configuration);
            _ce = new ComprobanteEgresoDao(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post(int idTipoDoc, int idComprobante, [FromBody] ComprobanteEgresoViewModel data)
        {
            GenericResponse _response = new GenericResponse();
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("idTipoDocumento", idTipoDoc);
            parameters.Add("idComprobante", idComprobante);
            parameters.Add("idProveedor", data.comprobanteEgreso.idProveedor);
            parameters.Add("codEstab", data.comprobanteEgreso.codEstab);
            parameters.Add("total", data.comprobanteEgreso.total);
            parameters.Add("jsonPago", JsonConvert.SerializeObject(data.pagos));
            parameters.Add("jsonPagoDetalle", JsonConvert.SerializeObject(data.pagoDetalle));
            _response = DbResponse.SPDefault(await _dao.GetDataTableAsync("GestFinanc.ComprobanteEgreso_Insert", parameters));
            if (_response.id == "1")
            {
                _ef.Update(_idRol, _response.payload);
            }
            return Ok(_response);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var res = await _ce.GetAsync(_idRol, json);
            return Ok(res);
        }


        public async Task<IActionResult> Eliminar(int idComprobanteEgreso, string observacion)
        {
            GenericResponse _response = new GenericResponse();
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", idComprobanteEgreso);
            parameters.Add("observacion", observacion);
            _response = DbResponse.SPDefault(await _dao.GetDataTableAsync("GestFinanc.ComprobanteEgreso_Delete", parameters));
            if (_response.id == "1")
            {
                _ef.Update(_idRol, _response.payload);
            }
            return Ok(_response);
        }


        public async Task<IActionResult> GetByDocument(int idTipoDocumento, int idComprobante)
        {
           var res = await _ce.GetByDocumentAsync(_idRol, idTipoDocumento, idComprobante);
            return Ok(res);

        }
    }
}
