using Common.Logs;
using DataAccess;
using Domain.Dtos;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiInventory.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
    public class ArticuloController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ArticuloController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet("Search")]
        public async Task<IActionResult> Search(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Search");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Get Search: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener las bodegas");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPost("Post")]
        public async Task<IActionResult> Post([FromBody] RequestApiDto parameters)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Articulo_Insert_v2");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(DataHelper.SerializeDictionary(parameters.data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error al insertar articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
