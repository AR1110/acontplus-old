using DataAccess;
using Lib.Common.DbUtils;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiConfig.Controllers.Sri
{
    public class EstablecimientoController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public EstablecimientoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }
        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Sri.Establecimiento_Get");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
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

        [HttpGet("GetId")]
        public async Task<IActionResult> GetId(string json)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Sri.Establecimiento_Get_Id");
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in GetId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("GetDataForm")]
        public async Task<IActionResult> GetDataForm()
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Sri.Establecimiento_Get_Data_Form");
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in GetDataForm: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Insert(string json)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Sri.Establecimiento_Insert");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Insert: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}/{json}")]
        public async Task<IActionResult> Update(int id, string json)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Sri.Establecimiento_Update");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Update: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPut("PutSriAuth/{id}/{autoSriAuth}")]
        public async Task<IActionResult> PutSriAuth(int id, bool autoSriAuth)
        {
            GenericResponse _response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    var query = @"UPDATE Sri.Establecimiento SET autoSriAuth = @autoSriAuth WHERE idEstablecimiento = @id";
                    await _db.QueryExecute(query);
                    _db.AddDynamicParam("id", id);
                    _db.AddDynamicParam("autoSriAuth", autoSriAuth);
                    _db.OnlyExecute();
                    _response.Create(code: "1", message: "Actualizado exitosamente");
                }
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Put Sri Auto: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar");
            }
            return Ok(_response);
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Sri.Establecimiento_Delete");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Delete: \n" + ex.ToString());
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
