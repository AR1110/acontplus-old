using Helpers;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebUI.Utils;

namespace WebUI.Controllers
{
    public class EstabLogoController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private DataAccessObject _dao;
        private readonly int _idRol;

        public EstabLogoController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);

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
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("codEstab", data.codEstab);
            parameters.Add("imagen", signFile.Content);
            parameters.Add("mimeType", signFile.ContentType);
            parameters.Add("nombreImagen", data.nombreImagen ?? "");
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.Estab_Logo_Insert", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Config.Estab_Logo_Delete", parameters)));
        }

    }
}
