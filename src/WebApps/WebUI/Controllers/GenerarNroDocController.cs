using DataAccess;
using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class GenerarNroDocController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private GenerarNroDoc _gNumDoc;

        public GenerarNroDocController(IConfiguration config)
        {
            _config = config;
            _gNumDoc = new GenerarNroDoc(_config);
        }


        public IActionResult Index()
        {
            return View();
        }

        //Generacion de numero de documentos para modulo compras 
        public async Task<IActionResult> GenerarNroDocCompra(string puntoEmision, int idPuntoEmision, int nroDocumento, string codigoDocumento)
        {
            var res = await _gNumDoc.GenerarNroDcAsync(puntoEmision, idPuntoEmision, nroDocumento, codigoDocumento);
            return Ok(res);
        }

        //Generacion de numero de documentos para modulo Ventas  
        public async Task<IActionResult> GenerarNroDocVenta(string puntoEmision, int idPuntoEmision, int nroDocumento, string codigoDocumento)
        {
            var res = await _gNumDoc.GenerarNroDvAsync(puntoEmision, idPuntoEmision, nroDocumento, codigoDocumento);
            return Ok(res);
        }


    }
}
