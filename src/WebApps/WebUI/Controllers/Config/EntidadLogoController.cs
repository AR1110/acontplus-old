using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using WebUI.Utils;

namespace WebUI.Controllers.Config
{
    public class EntidadLogoController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private EntidadLogoDao _el;

        public EntidadLogoController(IConfiguration config)
        {
            _config = config;
            _el = new EntidadLogoDao(_config);
        }

        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Get()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var response = await _el.GetAsync(idRol);
            return Ok(response);
        }
        public async Task<IActionResult> Post(EntidadLogo data, IFormFile file)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var nombreImagen = FileExtensions.SanitizeFileName(file.FileName);
            data.nombreImagen = nombreImagen;
            var signFile = new FileModel
            {
                FileName = FileExtensions.SanitizeFileName(file.FileName),
                ContentType = file.ContentType,
                Content = FileData.GetFileByte(file)
            };
            var response = await _el.InsertAsync(idRol, data, signFile);
            return Ok(response);
        }
        public async Task<IActionResult> Put(EntidadLogo data, IFormFile file)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var nombreImagen = FileExtensions.SanitizeFileName(file.FileName);
            data.nombreImagen = nombreImagen;
            var signFile = new FileModel
            {
                FileName = FileExtensions.SanitizeFileName(file.FileName),
                ContentType = file.ContentType,
                Content = FileData.GetFileByte(file)
            };
            var response = await _el.UpdateAsync(idRol, data, signFile);
            return Ok(response);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var response = await _el.DeleteAsync(idRol, id);
            return Ok(response);
        }
    }
}
