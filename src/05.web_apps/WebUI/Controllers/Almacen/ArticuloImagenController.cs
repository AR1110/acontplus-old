using DataAccess.Almacen;
using WebUI.Utils;
using Domain.Models.Almacen;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Almacen
{
    public class ArticuloImagenController : Controller
    {
        ArticuloImagenDao _ai = new();
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

        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var res = await _ai.UploadImagen(idRol, list, idArticulo);
        //    return Ok(res);
        //}

        [HttpPost]
        public async Task<IActionResult> UploadImagen(int idArticulo, [FromBody] List<ArticuloImagen> list)
        {           
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _ai.UploadImagen(idRol, list, idArticulo);
            return Ok(res);
        }

        public async Task<IActionResult> GetArticuloImagen(int idArticulo)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _ai.GetImagenAsync(idRol, idArticulo);
            return Ok(res);
        }

        public async Task<IActionResult> ArticuloImagenGetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _ai.ArticuloImagenGetAllAsync(idRol);
            return Ok(res);
        }

    }
}
