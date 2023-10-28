using Common.Core.Utils;
using DataAccess;
using Domain.Models;
using Domain.Models.Config;
using Microsoft.AspNetCore.Mvc;
using WebUI.Utils;

namespace WebUI.Controllers.Config
{
    public class EstabLogoController : Controller
    {
        private readonly IConfiguration _configuration;

        private DataAccessObject _dao;


        public EstabLogoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);



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
            var parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("codEstab", data.codEstab);
            parameters.Add("imagen", signFile.Content);
            parameters.Add("mimeType", signFile.ContentType);
            parameters.Add("nombreImagen", data.nombreImagen ?? "");
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.Estab_Logo_Insert", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.Estab_Logo_Delete", parameters)));
        }

    }
}
