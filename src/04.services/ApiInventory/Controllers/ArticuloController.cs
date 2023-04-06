using Common.Logs;
using DataAccess;
using Domain.Models.Almacen;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiInventory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticuloController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;

        public ArticuloController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(configuration);
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
                await _db.SPExecute("Almacen.Articulo_Get");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error on SubFamilia -> Get: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] SubFamilia data)
        {
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Inventario.SubCategoria_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("descripcion", SqlValidation.ValidateSqlString(data.descripcion));
                _db.AddDynamicParam("siglas", SqlValidation.ValidateSqlString(data.siglas));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error on SubFamilia -> Insert: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
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
                //return Ok(await _dao.GetDataSet("Inventario.SubCategoria_Update", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on SubFamilia -> Update: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
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
                //return Ok(await _dao.GetDataSet("Inventario.SubCategoria_Update_Cancel", _params));
            }
            catch (Exception ex)
            {
                _log.LogError("Error on SubFamilia -> Update Cancel: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
