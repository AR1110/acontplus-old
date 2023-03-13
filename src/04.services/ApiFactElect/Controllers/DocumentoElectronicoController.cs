using Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiFactElect.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoElectronicoController : ControllerBase
    {
        private readonly IConfiguration _configuration;    
        
        public DocumentoElectronicoController(IConfiguration configuration)
        {
            _configuration = configuration;           
        }

        [HttpGet("{json}")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("idRol", idUsuarioRol);
                parameters.Add("json", SqlValidation.ValidateSqlString(json));
                return Ok(await _dao.GetDataSet("FactElect.Doc_Elect_Get", parameters));
            }catch(Exception ex)
            {
                _logs.LogError("Error al obtener la solicitud: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener la solicitud"
                });
            }                                                    
            
        }

        [HttpGet("GetDataForm")]
        public async Task<IActionResult> GetDataForm()
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                DAO _dao = new DAO(_configuration);                             
                return Ok(await _dao.GetDataSet("FactElect.Doc_Elect_Get_Data_Form"));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error while getting data form: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error while getting data form"
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("idRol", idUsuarioRol);
                parameters.Add("id", id);
                return Ok(await _dao.Default("FactElect.Doc_Elect_Update", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error while updating doc: \n " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al actualizar el documento"
                });
            }

        }

    }
}
