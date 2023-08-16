using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiFactElect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoElectronicoErrorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public DocumentoElectronicoErrorController(IConfiguration configuration, LogWriter log)
        {

            _configuration = configuration;
            _log = log;
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
                
                _log.LogActivity("Error on get DocElectErrror: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
