using DataAccess;
using Lib.Common;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace WebUI.Controllers.Sistema
{
    public class ImpuestoEstadoController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public ImpuestoEstadoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Sistema.Impuestos_Get_Data_Form");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Get: \n" + ex.ToString());
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
