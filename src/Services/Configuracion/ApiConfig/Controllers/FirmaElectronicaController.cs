using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using WebUI.Utils;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FirmaElectronicaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public FirmaElectronicaController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Config.FirmaElectronica_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Get Firma Electronica: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener la firma electronica");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post(FirmaElectronica data, IFormFile file)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
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
                if (await new FileUpload().Upload(_configuration.GetSection("FactElectCerts").Value, signFile.FileName, signFile.Content))
                {
                    await _db.SPExecute("Config.FirmaElectronica_Insert");
                    _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                    _db.AddDynamicParam("contrasenia", data.contrasenia);
                    _db.AddDynamicParam("fileName", signFile.FileName);
                    _db.AddDynamicParam("firma", signFile.Content);
                    _db.AddDynamicParam("contentType", signFile.ContentType);
                    _db.AddDynamicParam("fechaCaducidad", data.fechaCaducidad);
                    _response = _db.GetDefault();
                }
                else
                {
                    _response.Create("0", "Error al subir la firma");
                }
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Insert Firma Electronica: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al registrar la firma electronica");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        public async Task<IActionResult> Put(FirmaElectronica data, IFormFile file)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
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
                if (await new FileUpload().Upload(_configuration.GetSection("FactElectCerts").Value, signFile.FileName, signFile.Content))
                {
                    await _db.SPExecute("Config.FirmaElectronica_Update");
                    _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                    _db.AddDynamicParam("idFirmaElectronica", data.idFirmaElectronica);
                    _db.AddDynamicParam("contrasenia", data.contrasenia);
                    _db.AddDynamicParam("fileName", signFile.FileName);
                    _db.AddDynamicParam("firma", signFile.Content);
                    _db.AddDynamicParam("contentType", signFile.ContentType);
                    _db.AddDynamicParam("fechaCaducidad", data.fechaCaducidad);
                    _response = _db.GetDefault();
                }
                else
                {
                    _response.Create("0", "Error al actualizar la firma");
                }
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Update Firma Electronica: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Actualizar la firma electronica");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
