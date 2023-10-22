using DataAccess;
using Domain.Models;
using Domain.Models.Archivos;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;
using WebUI.Utils;

namespace WebUI.Controllers.Archivos
{
    public class LogoSucursalController : Controller
    {
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;


        public LogoSucursalController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);



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
            var parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("idSucursal", data.idSucursal);
            parameters.Add("imagen", signFile.FileName);
            parameters.Add("mimeType", signFile.ContentType);
            parameters.Add("nombreImagen", data.nombreImagen ?? "");
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Archivos.LogoSucursal_Insert", parameters)));
        }

    }
}
