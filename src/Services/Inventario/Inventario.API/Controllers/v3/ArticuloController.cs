using Services.Common.Logs;
using DataAccess;
using Domain.Dtos;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Amazon.Runtime;
using Inventario.Core.Models;
using Inventario.Core.Interfaces;

namespace Inventario.API.Controllers.v3
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("3.0")]
    public class ArticuloController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IStorageService _storageService;
        public ArticuloController(IConfiguration configuration, IStorageService storageService)
        {
            _configuration = configuration;
            _storageService = storageService;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al listar articulos: \n" + ex.ToString());
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
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al obtener datos del articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos del articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("Search")]
        public async Task<IActionResult> Search(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Inventario.Articulo_Search_v3");
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Get Search: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener las Articulos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("upload")]

        [DisableRequestSizeLimit]

        public async Task<IActionResult> Upload()

        {

            //if (!Request.Form.Files.Any()) 

            //    return BadRequest("No files found in the request"); 



            //if (Request.Form.Files.Count > 1) 

            //    return BadRequest("Cannot upload more than one file at a time"); 



            //if (Request.Form.Files[0].Length <= 0) 

            //    return BadRequest("Invalid file length, seems to be empty"); 

            //IFormFile file = Request.Form.Files[0]; 

            var formCollection = await Request.ReadFormAsync();

            var file = formCollection.Files.First();

            await using var memoryStream = new MemoryStream();

            await file.CopyToAsync(memoryStream);

            var fileExt = Path.GetExtension(file.FileName);
            var directory = "articulos/";
            var docName = $"{Guid.NewGuid()}{fileExt}";

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
            var result = await _storageService.UploadFileAsync(s3, credentials);
            return Ok(result);

        }


    }
}
