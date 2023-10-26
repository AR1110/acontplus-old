using Common.Core.Interfaces;
using Common.Core.Models;
using DataAccess;
using Domain.Models.Almacen;
using Inventario.Core.Interfaces;
using Inventario.Core.Models;
using Lib.Common.Api;
using Lib.Common.DbUtils;
using Lib.Common.Dtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    public class SubFamiliaController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IStorageService _storageService;
        private readonly LogWriter _log;
        public SubFamiliaController(IConfiguration configuration, IStorageService storageService, LogWriter log)
        {
            _configuration = configuration;
            _storageService = storageService;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Inventario.Subfamilia_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar SubFamilias: \n" + ex.ToString());
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
            var s3file = new S3FileDto();
            try
            {
                if (file != null)
                {
                    var fileExt = Path.GetExtension(file.FileName);
                    s3file.BucketName = _configuration["S3Bucket:Name"];
                    s3file.Region = _configuration["S3Bucket:Region"];
                    s3file.S3ObjectKey = $"{User.GetIDCardCompany()}/subfamilias/{Guid.NewGuid()}{fileExt}";
                    s3file.S3ObjectUrl = $"https://{s3file.BucketName}.s3.{s3file.Region}.amazonaws.com/{s3file.S3ObjectKey}";
                }
                await _db.SPExecute("Inventario.Subfamilia_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("idFamilia", data.idFamilia);
                _db.AddDynamicParam("descripcion", data.descripcion);
                _db.AddDynamicParam("siglas", data.siglas);
                _db.AddDynamicParam("montoObjetivo", data.montoObjetivo);
                _db.AddDynamicParam("s3ObjectKey", s3file.S3ObjectKey ?? "");
                _db.AddDynamicParam("s3ObjectUrl", s3file.S3ObjectUrl ?? "");

                _response = _db.GetDefault();
                if (_response.code == "1" && file != null)
                {

                    await using var memoryStream = new MemoryStream();

                    await file.CopyToAsync(memoryStream);
                    var s3 = new S3Object()
                    {
                        BucketName = s3file.BucketName,
                        InputStream = memoryStream,
                        Name = s3file.S3ObjectKey
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

                _log.LogActivity("Error al insertar subfamilia: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar subfamilia");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Put/{id}")]
        public async Task<IActionResult> Put(int id, string json, IFormFile file)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            var data = JsonConvert.DeserializeObject<SubFamilia>(json);

            var s3file = new S3FileDto();
            try
            {
                if (file != null)
                {
                    var fileExt = Path.GetExtension(file.FileName);
                    s3file.BucketName = _configuration["S3Bucket:Name"];
                    s3file.Region = _configuration["S3Bucket:Region"];
                    s3file.S3ObjectKey = $"{User.GetIDCardCompany()}/subfamilias/{Guid.NewGuid()}{fileExt}";
                    s3file.S3ObjectUrl = $"https://{s3file.BucketName}.s3.{s3file.Region}.amazonaws.com/{s3file.S3ObjectKey}";
                }
                await _db.SPExecute("Inventario.Subfamilia_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("idFamilia", data.idFamilia);
                _db.AddDynamicParam("descripcion", data.descripcion);
                _db.AddDynamicParam("montoObjetivo", data.montoObjetivo);
                _db.AddDynamicParam("estado", data.estado);
                _db.AddDynamicParam("s3ObjectKey", s3file.S3ObjectKey ?? "");
                _db.AddDynamicParam("s3ObjectUrl", s3file.S3ObjectUrl ?? "");
                _response = _db.GetDefault();
                if (_response.code == "1" && file != null)
                {

                    await using var memoryStream = new MemoryStream();

                    await file.CopyToAsync(memoryStream);
                    var s3 = new S3Object()
                    {
                        BucketName = s3file.BucketName,
                        InputStream = memoryStream,
                        Name = s3file.S3ObjectKey
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

                _log.LogActivity("Error al actualizar subfamilia: \n" + ex.ToString());
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

                _log.LogActivity("Error al eliminar subfamilia: \n" + ex.ToString());
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
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar SubFamilias para Select: \n" + ex.ToString());
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
