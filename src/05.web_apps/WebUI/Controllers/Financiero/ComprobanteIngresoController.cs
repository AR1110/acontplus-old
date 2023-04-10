using Helpers;
using DataAccess;
using DataAccess.Tesoreria;
using Domain.Models;
using Domain.ViewModels.Tesoreria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace WebUI.Controllers.GestionFinanciera
{
    public class ComprobanteIngresoController : Controller
    {
        private ComprobanteIngresoDao _ci;
        private readonly IConfiguration _configuration;
        
        private DataAccessObject _dao;
        
        private EstadoFinancieroDao _ef;

        public ComprobanteIngresoController(IConfiguration configuration)
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
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("GestFinanc.ComprobanteIngreso_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Insert(int idTipoDocumento, int idComprobante, [FromBody] ComprobanteIngresoViewModel data)
        {
            GenericResponse _response = new GenericResponse();
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("idTipoDocumento", idTipoDocumento);
            parameters.Add("idComprobante", idComprobante);
            parameters.Add("idCliente", data.comprobanteIngreso.idCliente);
            parameters.Add("codEstab", data.comprobanteIngreso.codEstab);
            parameters.Add("total", data.comprobanteIngreso.total);
            parameters.Add("abono", data.comprobanteIngreso.abono);
            parameters.Add("jsonCobro", JsonConvert.SerializeObject(data.cobros));
            parameters.Add("jsonCobroDetalle", JsonConvert.SerializeObject(data.cobroDetalles));
            _response = DbResponse.SPDefault(await _dao.GetDataTableAsync("GestFinanc.ComprobanteIngreso_Insert", parameters));
            if (_response.code == "1")
            {
                _ef.Update(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), _response.payload);
            }
            return Ok(_response);
        }

        //Cunado se realiza cobro rapido 
        [HttpPost]
        public async Task<IActionResult> PostFast(int idTipoDoc, int idComprobante, [FromBody] ComprobanteIngresoViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ci.PostFastAsync(idRol, idTipoDoc, idComprobante, data);
            return Ok(res);

        }


        public async Task<IActionResult> Anular(int idComprobanteIngreso, string observacion)
        {
            GenericResponse _response = new GenericResponse();
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", idComprobanteIngreso);
            parameters.Add("observacion", observacion);
            _response = DbResponse.SPDefault(await _dao.GetDataTableAsync("GestFinanc.ComprobanteIngreso_Delete", parameters));
            if (_response.id == "1")
            {
                _ef.Update(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), _response.payload);
            }
            return Ok(_response);
        }



        public async Task<IActionResult> GetByDocument(int idTipoDocumento, int idComprobante)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ci.GetByDocumentAsync(idRol, idTipoDocumento, idComprobante);
            return Ok(res);

        }

    }
}
