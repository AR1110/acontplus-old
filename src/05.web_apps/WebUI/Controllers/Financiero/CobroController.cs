using DataAccess.Tesoreria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.GestionFinanciera
{
    public class CobroController : Controller
    {
        private readonly IConfiguration _configuration;

        private CobroDao _c;
        public CobroController(IConfiguration configuration)
        {
            _configuration = configuration;
            _c = new CobroDao(_configuration);
        }

        
        public IActionResult Index()
        {            
            return View();
        }


        public async Task<IActionResult> GetByDocument(int idComprobanteIngreso, int idTipoDoc, int idComprobante)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _c.GetByDocumentAsync(idRol, idComprobanteIngreso, idTipoDoc, idComprobante);
            return Ok(res);

        }
         
        public async Task<IActionResult> Put(int idCobro, string observacion, bool cobro, bool anular)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _c.UpdateAsync(idRol, idCobro, observacion, cobro, anular);
            return Ok(res);
        }

        public async Task<IActionResult> GetByComprobante(int idComprobanteIngreso)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _c.GetByComprobanteAsync(idRol, idComprobanteIngreso);
            return Ok(res);
        }

    }
}
