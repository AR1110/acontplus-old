using DataAccess;
using Domain.Models.Almacen;
using Helpers;
using Inventario.Core.Interfaces;
using Inventario.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Logs;
using System.IO;

namespace Inventario.API.Controllers
{
    public class SubFamiliaController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IStorageService _storageService;
        public SubFamiliaController(IConfiguration configuration, IStorageService storageService)
        {
            _configuration = configuration;
            _storageService = storageService;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.SubFamilia_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al listar SubFamilias: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar SubFamilias");
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
            var data = JsonConvert.DeserializeObject<SubFamilia>(json);
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            string directory = string.Empty, docName = string.Empty;
            try
            {
                if (file != null)
                {
                    var fileExt = Path.GetExtension(file.FileName);
                    directory = "subfamilias/";
                    docName = $"{Guid.NewGuid()}{fileExt}";
                }
                await _db.SPExecute("Almacen.SubFamilia_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("idFamilia", data.idFamilia);
                _db.AddDynamicParam("descripcion", data.descripcion);
                _db.AddDynamicParam("siglas", data.siglas);
                _db.AddDynamicParam("montoObjetivo", data.montoObjetivo);
                _db.AddDynamicParam("imgUrl", directory + docName);
                _response = _db.GetDefault();
                if (_response.code == "1" && file != null)
                {
                 
                    await using var memoryStream = new MemoryStream();

                    await file.CopyToAsync(memoryStream);
                    var s3 = new S3Object()
                    {
                        BucketName = "acontplus",
                        InputStream = memoryStream,
                        Name = directory + docName
                    };
                    var credentials = new AwsCredentials()
                    {
                        Key = _configuration["AwsConfiguration:AWSAccessKey"],
                        Secret = _configuration["AwsConfiguration:AWSSecretKey"]
                    };
                   var s3Response = await _storageService.UploadFileAsync(s3, credentials);
                }
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al insertar subfamilia: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar subfamilia");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] SubFamilia data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.SubFamilia_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("idFamilia", data.idFamilia);
                _db.AddDynamicParam("descripcion", data.descripcion);
                _db.AddDynamicParam("montoObjetivo", data.montoObjetivo);
                _db.AddDynamicParam("estado", data.estado);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al actualizar subfamilia: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar subfamilia");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.SubFamilia_Update_Cancel");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al eliminar subfamilia: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar subfamilia");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("ListForSelect")]
        public async Task<IActionResult> ListForSelect(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.SubFamilia_For_Select");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al listar SubFamilias para Select: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar SubFamilias para Select");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}