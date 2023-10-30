using Common.Core.Models;
using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace FactElect.API.Controllers.Sri
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatalogoController : ControllerBase
    {
        private readonly IConfiguration _config;
        public CatalogoController(IConfiguration config) => _config = config;
        [HttpGet("Get")]
        public async Task<IActionResult> Get()
        {
            var _response = new GenericResponse();

            try
            {
                using (var db = new DbAccess(_config))
                {
                    await db.SPExecute("Sri.Catalogo_Get");
                    _response = db.GetDataTableAsync();
                }
            }
            catch (Exception)
            {
                _response.Create("0", "Error al obtener la lista de catalogos del SRI");
                //LogWritter.LogError(_config.GetSection("CustomLogs").GetSection("dirLogs").Value, "Error getting sri catalogs:" + ex.Message);
            }
            return Ok(_response);
        }
    }
}
