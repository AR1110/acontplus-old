using Common.Logs;
using DataAccess;
using Domain.Inventory.Models;
using Domain.Models.Almacen;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiInventory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubFamiliaController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public SubFamiliaController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        // GET: api/<SubCategoriaController>
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["json"] = SqlValidation.ValidateSqlString(json);
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataSet("Almacen.SubFamilia_Get", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on SubFamilia -> Get: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] SubFamilia data)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["descripcion"] = SqlValidation.ValidateSqlString(data.descripcion);
                _params["siglas"] = SqlValidation.ValidateSqlString(data.siglas);
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataSet("Almacen.SubFamilia_Insert", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on SubFamilia -> Insert: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] SubFamilia data)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["idCategoria"] = id;
                _params["descripcion"] = SqlValidation.ValidateSqlString(data.descripcion);
                _params["siglas"] = SqlValidation.ValidateSqlString(data.siglas);
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataSet("Almacen.SubFamilia_Update", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on SubFamilia -> Update: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCancel(int id)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                Dictionary<string, object> _params = new Dictionary<string, object>();
                _params["idUsuarioRol"] = idUsuarioRol;
                _params["idSubFamilia"] = id;
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataSet("Almacen.SubFamilia_Update_Cancel", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on SubFamilia -> Update Cancel: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
