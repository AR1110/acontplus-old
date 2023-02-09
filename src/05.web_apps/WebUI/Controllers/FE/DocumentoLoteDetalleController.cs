using DataAccess.FE;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.FE
{
    public class DocumentoLoteDetalleController : Controller
    {
        private DocumentoLoteDetalleDao _dld;
        public DocumentoLoteDetalleController()
        {
            _dld = new DocumentoLoteDetalleDao();
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
