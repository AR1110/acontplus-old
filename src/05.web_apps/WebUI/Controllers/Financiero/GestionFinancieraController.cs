using DataAccess;
using DataAccess.Tesoreria;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.GestionFinanciera
{
    public class GestionFinancieraController : Controller
    {
        private GestionFinancieraDao _gf;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        GenericResponse _gr = new();

        public GestionFinancieraController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _gf = new GestionFinancieraDao(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        //Obtenemos los documentos para cobros por lote
        [HttpGet]
        public async Task<IActionResult> GetDocumentsCharge(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", json);
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("ASPDocumentsCharge", parameters)));
        }

        [HttpGet]
        //Get All Docs By Supplier - Proveedor 
        public async Task<IActionResult> GetDocumentsPay(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _gf.GetDocumentsPayAsync(idRol, json);
            return Ok(res);
        }

        // 
        public async Task<IActionResult> GetPaymentForDocument(int idProveedor)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _gf.GetPaymentForDocumentAsync(idRol, idProveedor);
            return Ok(res);
        }

        [HttpGet]
        //Obtenemos documentos(Retencion Venta y Nota Creditp) que se aplicará en el cobro 
        public async Task<IActionResult> GetChargeForDocument(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _gf.GetChargeForDocumentAsync(idRol, json);
            return Ok(res);
        }
    }
}
