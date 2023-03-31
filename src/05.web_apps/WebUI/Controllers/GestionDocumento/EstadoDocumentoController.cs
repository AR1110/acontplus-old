using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.GestionDocumento
{
    public class EstadoDocumentoController : Controller
    {
        private readonly IConfiguration _configuration;
        private EstadoDocumentoDao _eDoc;
        public EstadoDocumentoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _eDoc = new EstadoDocumentoDao(_configuration);
        }
        
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _eDoc.GetAsync(json));
        }

    }
}
