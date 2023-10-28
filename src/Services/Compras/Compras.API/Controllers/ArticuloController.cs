using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Compras.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ArticuloController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public ArticuloController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
            _db = new DbAccess(_configuration);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {

            var _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Articulo_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("jsonData", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener los articulos: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener los articulos");

            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
