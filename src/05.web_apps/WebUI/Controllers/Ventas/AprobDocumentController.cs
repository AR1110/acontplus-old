using Common.Logs;
using DataAccess;
using Domain.Models.Ventas;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Ventas
{
    public class AprobDocumentController : Controller
    {
        private readonly IConfiguration _configuration;
        public AprobDocumentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Aprob_Document_Get");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
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

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Aprob_Document_Get_Id");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in GetId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] AprobDocument data)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Aprob_Document_Insert");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("jsonHeader", SqlValidation.ValidateSqlString(data.jsonHeader));
                _db.AddDynamicParam("jsonDetail", SqlValidation.ValidateSqlString(data.jsonDetail));
                _db.AddDynamicParam("jsonHistory", SqlValidation.ValidateSqlString(data.jsonHistory));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in Insert: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] AprobDocument data)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Aprob_Document_Update");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("jsonHeader", SqlValidation.ValidateSqlString(data.jsonHeader));
                _db.AddDynamicParam("jsonDetail", SqlValidation.ValidateSqlString(data.jsonDetail));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in update: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Aprob_Document_Delete");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in delete: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
