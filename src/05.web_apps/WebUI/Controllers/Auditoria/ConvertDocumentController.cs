using DataAccess.Auditoria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Auditoria
{
    public class ConvertDocumentController : Controller
    {
        ConvertDocumentDao _cd = new();
        [Authorize]
        // GET: ConvertDocumentController
        public ActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> GetInformacionDoc(int idTipoDoc, int idDoc)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _cd.GetByDocumentAsync(idRol, idTipoDoc, idDoc);
            return Ok(res);
        }

        
    }
}
