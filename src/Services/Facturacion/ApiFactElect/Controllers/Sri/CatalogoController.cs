using System.Data;
using DataAccess;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;

namespace ApiFactElect.Controllers.Sri
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatalogoController : ControllerBase
    {
        private readonly IConfiguration _config;
        public CatalogoController(IConfiguration config) => (_config) = (config);
        [HttpGet("Get")]
        public async Task<IActionResult> Get()
        {
            GenericResponse _response = new GenericResponse();

            try
            {
                DbAccess db = new DbAccess(_config);
                await db.SPExecute("Sri.Catalogo_Get");
                DataTable dt = db.GetDataTable();
                _response.Create(code: "1", payload: Converters.DataTableToJSON(dt));
            }
            catch (Exception ex)
            {
                _response.Create("0", "Error al obtener la lista de catalogos del SRI");
                //LogWritter.LogError(_config.GetSection("CustomLogs").GetSection("dirLogs").Value, "Error getting sri catalogs:" + ex.Message);
            }
            return Ok(_response);
        }
    }
}
