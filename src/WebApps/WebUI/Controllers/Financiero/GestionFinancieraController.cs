using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Common.Infrastructure.Repository.GestionFinanciera;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace WebUI.Controllers.Financiero
{
    public class GestionFinancieraController : Controller
    {
        private GestionFinancieraDao _gf;
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0


        GenericResponse _gr = new();

        public GestionFinancieraController(IConfiguration configuration)
        {
            _configuration = configuration;

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
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("ASPDocumentsCharge");
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

        [HttpGet]
        //Get All Docs By Supplier - Proveedor 
        public async Task<IActionResult> GetDocumentsPay(string json)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _gf.GetDocumentsPayAsync(idRol, json);
            return Ok(res);
        }

        // 
        public async Task<IActionResult> GetPaymentForDocument(int idProveedor)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _gf.GetPaymentForDocumentAsync(idRol, idProveedor);
            return Ok(res);
        }

        [HttpGet]
        //Obtenemos documentos(Retencion Venta y Nota Creditp) que se aplicará en el cobro 
        public async Task<IActionResult> GetChargeForDocument(string json)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _gf.GetChargeForDocumentAsync(idRol, json);
            return Ok(res);
        }
    }
}
