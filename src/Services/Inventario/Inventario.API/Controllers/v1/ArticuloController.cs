using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common;
using Services.Common.Logs;

namespace Inventario.API.Controllers.v1
{
    [Route("api/articulo/[action]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class ArticuloController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IS3StorageService _storageService;
        private readonly LogWriter _log;
        public ArticuloController(IConfiguration configuration, IS3StorageService storageService, LogWriter log)
        {
            _configuration = configuration;
            _storageService = storageService;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Inventario.Articulo_Get");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar articulos: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar articulos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Id");
                //_db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al obtener datos del articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos del articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post(string json, IFormFile file)
        {

            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            var data = JsonConvert.DeserializeObject<ApiRequest>(json);
            var s3file = new S3File();

            try
            {
                if (file != null)
                {
                    var fileExt = Path.GetExtension(file.FileName);
                    s3file.BucketName = _configuration["S3Bucket:Name"];
                    s3file.Region = _configuration["S3Bucket:Region"];
                    s3file.S3ObjectKey = $"{User.GetIDCardCompany()}/articulos/{Guid.NewGuid()}{fileExt}";
                    s3file.S3ObjectUrl = $"https://{s3file.BucketName}.s3.{s3file.Region}.amazonaws.com/{s3file.S3ObjectKey}";
                }
                await _db.SPExecute("Inventario.Articulo_Insert", true);
                _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
                _db.AddDynamicParam("s3ObjectKey", s3file.S3ObjectKey ?? "");
                _db.AddDynamicParam("s3ObjectUrl", s3file.S3ObjectUrl ?? "");
                _response = _db.GetDefault();
                if (_response.code == "1" && file != null)
                {

                    await using var memoryStream = new MemoryStream();

                    await file.CopyToAsync(memoryStream);
                    var s3 = new S3ObjectCustom()
                    {
                        Region = s3file.Region,
                        BucketName = s3file.BucketName,
                        InputStream = memoryStream,
                        Name = s3file.S3ObjectKey
                    };
                    var credentials = new AwsCredentials()
                    {
                        Key = _configuration["AwsConfiguration:AWSAccessKey"],
                        Secret = _configuration["AwsConfiguration:AWSSecretKey"]
                    };
                    var s3Response = await _storageService.UploadAsync(s3, credentials);
                }
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al insertar articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> Put(int id, string json, IFormFile file)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            var data = JsonConvert.DeserializeObject<ApiRequest>(json);
            var s3file = new S3File();
            try
            {
                if (file != null)
                {
                    var fileExt = Path.GetExtension(file.FileName);
                    s3file.BucketName = _configuration["S3Bucket:Name"];
                    s3file.Region = _configuration["S3Bucket:Region"];
                    s3file.S3ObjectKey = $"{User.GetIDCardCompany()}/articulos/{Guid.NewGuid()}{fileExt}";
                    s3file.S3ObjectUrl = $"https://{s3file.BucketName}.s3.{s3file.Region}.amazonaws.com/{s3file.S3ObjectKey}";
                }
                await _db.SPExecute("Inventario.Articulo_Update");
                _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
                _db.AddDynamicParam("s3ObjectKey", s3file.S3ObjectKey ?? "");
                _db.AddDynamicParam("s3ObjectUrl", s3file.S3ObjectUrl ?? "");
                _response = _db.GetDefault();
                if (_response.code == "1" && file != null)
                {
                    await using var memoryStream = new MemoryStream();
                    await file.CopyToAsync(memoryStream);
                    var s3 = new S3ObjectCustom()
                    {
                        Region = s3file.Region,
                        BucketName = s3file.BucketName,
                        InputStream = memoryStream,
                        Name = s3file.S3ObjectKey
                    };
                    var credentials = new AwsCredentials()
                    {
                        Key = _configuration["AwsConfiguration:AWSAccessKey"],
                        Secret = _configuration["AwsConfiguration:AWSSecretKey"]
                    };
                    var s3Response = await _storageService.UploadAsync(s3, credentials);
                }
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al actualizar articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar articulo");
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
                await _db.SPExecute("Almacen.Articulo_Delete");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al eliminar articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet]
        public async Task<IActionResult> Search(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Search");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Get Search: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener las bodegas");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet]
        public async Task<IActionResult> FindForPurchase(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Id_By_Purchase");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Get For purchase: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de articulo para compra");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet]
        public async Task<IActionResult> FindForSale(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Id_By_Sale");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Get For Sales: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de articulo para venta");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet]
        public async Task<IActionResult> GetDataForm(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Sistema.Almacen_Get_Data_Form");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al obtener datos del form-articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos del form-articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }



}
