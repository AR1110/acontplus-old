using Asp.Versioning;
using Common.Core.Models;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Inventario.API.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
    public class ArticlePhotoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICustomLogger _log;
        public ArticlePhotoController(IConfiguration configuration, ICustomLogger log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            ApiResponse _response = new ApiResponse();
            DbAccess _db = new DbAccess(_configuration);

            try
            {
                await _db.SPExecute("Inventario.Articulo_Get_Id");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in articulo getId: \n" + ex.Message);
                _response.Create(code: "0", message: "Error al Obtener los datos del articulo " + ex.Message);
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
