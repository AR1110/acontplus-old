using Common.Core.Models;
using Common.Core.Models.Config;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using WebUI.Utils;

namespace WebUI.Controllers.Config
{
    public class EstabLogoController : Controller
    {
        private readonly IConfiguration _configuration;




        public EstabLogoController(IConfiguration configuration)
        {
            _configuration = configuration;




        }


        public IActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public async Task<IActionResult> Insert(EstabLogo data, IFormFile file)
        {
            var nombreImagen = FileExtensions.SanitizeFileName(file.FileName);
            data.nombreImagen = nombreImagen;
            var signFile = new FileModel
            {
                FileName = FileExtensions.SanitizeFileName(file.FileName),
                ContentType = file.ContentType,
                Content = FileData.GetFileByte(file)
            };
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Config.Estab_Logo_Insert");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("codEstab", data.codEstab);
                    _db.AddDynamicParam("imagen", signFile.Content);
                    _db.AddDynamicParam("mimeType", signFile.ContentType);
                    _db.AddDynamicParam("nombreImagen", data.nombreImagen ?? "");
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Config.Estab_Logo_Delete");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("id", id);
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
