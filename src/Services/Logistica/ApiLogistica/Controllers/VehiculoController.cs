using DataAccess;
using Domain.Models.Logistica;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiLogistica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiculoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public VehiculoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        /*
         const json = {
            typeList: 0, --Lista Normal 
            typeList: 1 => Para lISTAR EN SELECT HTML
            typeList: 2 => Para buscadores(autocomplete)
        }
         */
        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Logistica.Vehiculo_Get");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
               
                _log.LogActivity("Error al listar vehiculos: " + ex.ToString());
                _response.Create(code: "0", message: "Error al listar vehiculos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] Vehiculo data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Logistica.Vehiculo_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("placa", data.placa);
                _db.AddDynamicParam("marca", data.marca);
                _db.AddDynamicParam("modelo", data.modelo);
                _db.AddDynamicParam("observacion", DataHelper.ToDBNullOrDefault(data.observacion));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
               
                _log.LogActivity("Error while creating vehicle: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al crear el vehiculo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Vehiculo data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Logistica.Vehiculo_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("placa", data.placa);
                _db.AddDynamicParam("marca", data.marca);
                _db.AddDynamicParam("modelo", data.modelo);
                _db.AddDynamicParam("observacion", DataHelper.ToDBNullOrDefault(data.observacion));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
               
                _log.LogActivity("Error while updating vehicle: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar el vehiculo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Logistica.Vehiculo_Delete");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
               
                _log.LogActivity("Error while deleting vehicle: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar el vehiculo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpGet("Search")]
        public async Task<IActionResult> Search(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Logistica.Vehiculo_Search");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
               
                _log.LogActivity("Error while search vehicle: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al buscar el vehiculo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
