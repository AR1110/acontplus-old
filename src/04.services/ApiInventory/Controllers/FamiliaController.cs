using Common.Logs;
using DataAccess;
using Domain.Inventory.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiInventory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FamiliaController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public FamiliaController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        // GET: api/<CategoriaController>
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
                return Ok(await _dao.GetDataSet("Almacen.Familia_Get", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on Categoria -> Get: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] Familia data)
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
                return Ok(await _dao.Default("Almacen.Familia_Insert", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on Familia -> Insert: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] Familia data)
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
                return Ok(await _dao.GetDataSet("Alamcen.Familia_Update", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on Familia -> Update: \n" + ex.ToString());
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
                _params["idCategoria"] = id;
                DAO _dao = new DAO(_configuration);
                return Ok(await _dao.GetDataSet("Almacen.Familia_Update_Cancel", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on Familia -> Update Cancel: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

    }
}
