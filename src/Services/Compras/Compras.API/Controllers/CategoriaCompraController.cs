using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Compras.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaCompraController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public CategoriaCompraController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
            _db = new DbAccess(_configuration);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {

            var _response = new ApiResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Categoria_Get");
                _db.AddDynamicParam("userRoleId", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener las categorias compras: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener las categorias compras");

            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post(string json)
        {
            ApiResponse _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Compra.Categoria_Insert");
                _db.AddDynamicParam("userRoleId", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Post Category Buy: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar Categoria compra");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, string json)
        {
            ApiResponse _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Compra.Categoria_Update");
                _db.AddDynamicParam("userRoleId", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Put Category buy: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar la categoria compra");
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
            ApiResponse _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Compra.Categoria_Delete");
                _db.AddDynamicParam("userRoleId", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Delete Category buy: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al elimianr la categoria compra");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
