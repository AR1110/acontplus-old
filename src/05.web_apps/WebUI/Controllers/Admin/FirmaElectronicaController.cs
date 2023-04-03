using DataAccess;
using WebUI.Utils;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Helpers;

namespace WebUI.Controllers.Admin
{
    public class FirmaElectronicaController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _response = new();
        private FirmaElectronicaDao _fe;
        public FirmaElectronicaController(IConfiguration config)
        {
            _config = config;
            _fe = new FirmaElectronicaDao(_config);
        }
       
        
        public IActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Get()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var response = await _fe.GetAsync(idRol);
            return Ok(response);
        }

        public async Task<IActionResult> Post(FirmaElectronica data, IFormFile file)
        {
            try
            {
                int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
                if (file.ContentType != "application/x-pkcs12")
                {
                    _response.Create("0", "Formato de archivo no soportado");
                    return Ok(_response);
                }
                var signFile = new FileModel
                {
                    FileName = FileExtensions.SanitizeFileName(file.FileName),
                    ContentType = file.ContentType,
                    Content = FileData.GetFileByte(file)
                };
                //X509Certificate2 cert = new X509Certificate2(_dirCertificates + dataRow.Field<string>("certificate"), dataRow.Field<string>("password"), X509KeyStorageFlags.Exportable | X509KeyStorageFlags.PersistKeySet);
                //// Get the value.
                //string expirationDate = cert.GetExpirationDateString();
                string msg = string.Empty;

                if (new FileUpload(_config).Upload(signFile.FileName, signFile.Content, ref msg))
                {
                    _response = await _fe.InsertAsync(idRol, data, signFile);
                    return Ok(_response);
                }
                else
                {
                    _response.Create("0",msg);
                }
            }
            catch (Exception ex)
            {
                _response.Create("0", ex.Message);
            }
            return Ok(_response);
        }

        public async Task<IActionResult> Put([FromBody] FirmaElectronica data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var response = await _fe.UpdateAsync(idRol, data);
            return Ok(response);
        }
        public async Task<IActionResult> Delete(int idFirmaElectronica)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var response = await _fe.DeleteAsync(idRol, idFirmaElectronica);
            //ADD METHOD FOR DELETE FILE IN API
            return Ok(response);
        }
    }
}
