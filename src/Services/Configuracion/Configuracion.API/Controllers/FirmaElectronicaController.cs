using Configuracion.API.Helpers;
using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Logs;


namespace Configuracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FirmaElectronicaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public FirmaElectronicaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Config.FirmaElectronica_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Get Firma Electronica: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener la firma electronica");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Post")]
        public async Task<IActionResult> Post(string json, IFormFile file)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
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
                    var data = JsonConvert.DeserializeObject<FirmaElectronica>(json);
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

                _log.LogActivity("Error on Insert Firma Electronica: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al registrar la firma electronica");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpPost("UpdateSignature/{id}")]
        public async Task<IActionResult> UpdateSignature(int id, IFormFile file)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
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
                    await _db.SPExecute("Config.FirmaElectronica_Update_Signature");
                    _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                    _db.AddDynamicParam("id", id);
                    _db.AddDynamicParam("fileName", signFile.FileName);
                    _db.AddDynamicParam("firma", signFile.Content);
                    _db.AddDynamicParam("contentType", signFile.ContentType);
                    _response = _db.GetDefault();
                }
                else
                {
                    _response.Create("0", "Error al actualizar la firma");
                }
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Update Firma Electronica: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Actualizar la firma electronica");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpPut("Put")]
        public async Task<IActionResult> Put(string json)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                var data = JsonConvert.DeserializeObject<FirmaElectronica>(json);
                await _db.SPExecute("Config.FirmaElectronica_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("idFirmaElectronica", data.idFirmaElectronica);
                _db.AddDynamicParam("contrasenia", data.contrasenia);
                _db.AddDynamicParam("fechaCaducidad", data.fechaCaducidad);
                _db.AddDynamicParam("estado", data.estado);
                _response = _db.GetDefault();

            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Update Firma Electronica: \n" + ex.ToString());
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
