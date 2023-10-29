using DataAccess.FE;
using Microsoft.AspNetCore.Mvc;

namespace FactElect.API.Controllers
{
    public class DocumentoLoteDetalleController : BaseApiController
    {
        private readonly IConfiguration _configuration;

        private DocumentoLoteDetalleDao _dld;
        public DocumentoLoteDetalleController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dld = new DocumentoLoteDetalleDao(_configuration);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int idDocumentoLote)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            return Ok(await _dld.GetAsync(idRol, idDocumentoLote));
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            return Ok(await _dld.DeleteAsync(idRol, id));
        }
    }
}
