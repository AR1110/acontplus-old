using Services.Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiFactElect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoElectronicoErrorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public DocumentoElectronicoErrorController(IConfiguration configuration)
        {

            _configuration = configuration;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("FactElect.Doc_Elect_Error_Get_Id");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al obtener los errores");
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on get DocElectErrror: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
