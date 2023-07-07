using DataAccess;
using DataAccess.Tesoreria;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionFinanciera
{
    public class GestionFinancieraController : Controller
    {
        private GestionFinancieraDao _gf;
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        GenericResponse _gr = new();

        public GestionFinancieraController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _gf = new GestionFinancieraDao(_configuration);


        }


        public IActionResult Index()
        {
            return View();
        }

        //Obtenemos los documentos para cobros por lote
        [HttpGet]
        public async Task<IActionResult> GetDocumentsCharge(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", json);
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("ASPDocumentsCharge", parameters)));
        }

        [HttpGet]
        //Get All Docs By Supplier - Proveedor 
        public async Task<IActionResult> GetDocumentsPay(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _gf.GetDocumentsPayAsync(idRol, json);
            return Ok(res);
        }

        // 
        public async Task<IActionResult> GetPaymentForDocument(int idProveedor)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _gf.GetPaymentForDocumentAsync(idRol, idProveedor);
            return Ok(res);
        }

        [HttpGet]
        //Obtenemos documentos(Retencion Venta y Nota Creditp) que se aplicará en el cobro 
        public async Task<IActionResult> GetChargeForDocument(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _gf.GetChargeForDocumentAsync(idRol, json);
            return Ok(res);
        }
    }
}
