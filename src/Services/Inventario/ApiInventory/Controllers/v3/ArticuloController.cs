using Services.Common.Logs;
using DataAccess;
using Domain.Dtos;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiInventory.Controllers.v3
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("3.0")]
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
       
    }
}
