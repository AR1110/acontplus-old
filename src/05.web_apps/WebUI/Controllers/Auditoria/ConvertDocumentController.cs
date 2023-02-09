using DataAccess.Auditoria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Auditoria
{
    public class ConvertDocumentController : Controller
    {
        private readonly IConfiguration _configuration;
        private ConvertDocumentDao _cd;
        public ConvertDocumentController(IConfiguration configuration)
        {
            _configuration = configuration;
            _cd = new ConvertDocumentDao(_configuration);
        }
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
