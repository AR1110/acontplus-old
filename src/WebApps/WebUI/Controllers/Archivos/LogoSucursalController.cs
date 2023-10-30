using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Domain.Models;
using Domain.Models.Archivos;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using WebUI.Utils;

namespace WebUI.Controllers.Archivos
{
    public class LogoSucursalController : Controller
    {
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0



        public LogoSucursalController(IConfiguration configuration)
        {
            _configuration = configuration;




        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post(LogoSucursal data, IFormFile file)
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
                    await _db.SPExecute("Archivos.LogoSucursal_Insert");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("idSucursal", data.idSucursal);
                    _db.AddDynamicParam("imagen", signFile.FileName);
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

    }
}
