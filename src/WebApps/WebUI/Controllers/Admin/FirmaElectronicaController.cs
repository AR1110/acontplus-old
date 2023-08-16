using DataAccess;
using Domain.Models;
using Helpers;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;
using WebUI.Utils;

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
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var response = await _fe.GetAsync(idRol);
            return Ok(response);
        }

        public async Task<IActionResult> Post(FirmaElectronica data, IFormFile file)
        {
            try
            {
                int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
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

                if (await new FileUpload().Upload(_config.GetSection("FactElectCerts").Value, signFile.FileName, signFile.Content))
                {
                    _response = await _fe.InsertAsync(idRol, data, signFile);
                    return Ok(_response);
                }
                else
                {
                    _response.Create("0", "Error al subir la firma");
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
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var response = await _fe.UpdateAsync(idRol, data);
            return Ok(response);
        }
        public async Task<IActionResult> Delete(int idFirmaElectronica)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var response = await _fe.DeleteAsync(idRol, idFirmaElectronica);
            //ADD METHOD FOR DELETE FILE IN API
            return Ok(response);
        }
    }
}
