using DataAccess.Almacen;
using Domain.Models.Almacen;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Almacen
{
    public class ArticuloImagenController : Controller
    {
        private readonly IConfiguration _configuration;
        private ArticuloImagenDao _ai;
        public ArticuloImagenController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ai = new ArticuloImagenDao(_configuration);
        }

        public IActionResult Index()
        {
            return View();
        }

        //public async Task<IActionResult> UploadImagen(int idArticulo, IFormCollection file)
        //{
        //    var list = new List<ArticuloImagen>();
        //    foreach (var item in file.Files)
        //    {
        //        var i = new ArticuloImagen
        //        {
        //            nombreImagen = FileExtensions.SanitizeFileName(item.FileName),
        //            mimeType = item.ContentType
        //        };
        //        using (var target = new MemoryStream())
        //        {                    
        //            item.CopyTo(target);
        //            i.imagen = target.ToArray();
        //        }
        //        list.Add(i);
        //    };

        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        //    var res = await _ai.UploadImagen(idRol, list, idArticulo);
        //    return Ok(res);
        //}

        [HttpPost]
        public async Task<IActionResult> UploadImagen(int idArticulo, [FromBody] List<ArticuloImagen> list)
        {           
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ai.UploadImagen(idRol, list, idArticulo);
            return Ok(res);
        }

        public async Task<IActionResult> GetArticuloImagen(int idArticulo)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ai.GetImagenAsync(idRol, idArticulo);
            return Ok(res);
        }

        public async Task<IActionResult> ArticuloImagenGetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ai.ArticuloImagenGetAllAsync(idRol);
            return Ok(res);
        }

    }
}
