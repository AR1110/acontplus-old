using Services.Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Reports
{
    public class TipoImpresoraController : Controller
    {
        private readonly IConfiguration _configuration;
        public TipoImpresoraController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("ApiPrinter.TipoImpresora_Get");
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in Get: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
