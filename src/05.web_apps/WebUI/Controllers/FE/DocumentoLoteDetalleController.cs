using DataAccess.FE;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.FE
{
    public class DocumentoLoteDetalleController : Controller
    {
        private readonly IConfiguration _configuration;

        private DocumentoLoteDetalleDao _dld;
        public DocumentoLoteDetalleController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dld = new DocumentoLoteDetalleDao(_configuration); 
        }
        public async Task<IActionResult> Get(int idDocumentoLote)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _dld.GetAsync(idRol, idDocumentoLote));
        }
        public async Task<IActionResult> Delete(long id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return Ok(await _dld.DeleteAsync(idRol, id));
        }
    }
}
