using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiInventory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
                _db.AddDynamicParam("json", json);
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

        [HttpGet("FindForPurchase")]
        public async Task<IActionResult> FindForPurchase(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Id_By_Purchase");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on Get For purchase: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de articulo para compra");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }



}
