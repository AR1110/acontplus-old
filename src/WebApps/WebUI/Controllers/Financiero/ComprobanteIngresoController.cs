using DataAccess;
using DataAccess.Tesoreria;
using Domain.Dtos.Contabilidad;
using Domain.Models;
using Domain.ViewModels.Tesoreria;
using Helpers;
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

        [HttpDelete]
        public async Task<IActionResult> Cancel(int id, string observacion)
        {
            GenericResponse _response = new GenericResponse();
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("idComprobanteIngreso", id);
            parameters.Add("observacion", observacion);
            _response = DbResponse.SPDefault(await _dao.GetDataTableAsync("GestFinanc.ComprobanteIngreso_Delete", parameters));
            return Ok(_response);
        }


    }
}
