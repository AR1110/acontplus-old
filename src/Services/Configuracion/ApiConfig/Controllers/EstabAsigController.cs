using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace ApiConfig.Controllers
{
    public class EstabAsigController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        public EstabAsigController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.Estab_Asig_Get");
                _db.AddDynamicParam("idRol", User.GetUserRoleId());
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
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
