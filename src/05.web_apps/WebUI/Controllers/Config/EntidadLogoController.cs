using DataAccess;
using WebUI.Utils;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using Helpers;

namespace WebUI.Controllers.Configuracion
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
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var response = await _el.GetAsync(idRol);
            return Ok(response);
        }
        public async Task<IActionResult> Post(EntidadLogo data, IFormFile file)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
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
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
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
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var response = await _el.DeleteAsync(idRol, id);
            return Ok(response);
        }
    }
}
