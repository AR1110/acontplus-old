using DataAccess;
using Domain.Models;
using Lib.Common;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Logs;

namespace ApiVentas.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
    public class ClienteController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public ClienteController(IConfiguration configuration, LogWriter log)
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
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Cliente_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar clientes: " + ex.ToString());
                _response.Create(code: "0", message: "Error al listar clientes");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("GetDataForm")]
        public async Task<IActionResult> GetDataForm(string json)
        {

            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                await _db.SPExecute("Ventas.Cliente_Get_Data_Form");
                _db.AddDynamicParam("idUsuarioRol ", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while getting data form customer: " + ex.ToString());
                _response.Create(code: "0", message: "Error while getting data form customer");
            }
            finally { _db.Close(); }
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

                await _db.SPExecute("Ventas.Cliente_Get_Search_v2");
                _db.AddDynamicParam("idRol ", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while searching data form customer: " + ex.ToString());
                _response.Create(code: "0", message: "Error al buscar cliente");
            }
            finally { _db.Close(); }
            return Ok(_response);
        }


        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] Cliente data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Cliente_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", JsonConvert.SerializeObject(data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while creating customer: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al crear el cliente");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Cliente data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Cliente_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", JsonConvert.SerializeObject(data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while updating customer: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar el cliente");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("UpdateApp/{id}")]
        public async Task<IActionResult> UpdateApp(int id, [FromBody] Cliente data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Cliente_Update_App");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", JsonConvert.SerializeObject(data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while updating customer: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar el cliente");
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
                await _db.SPExecute("Ventas.Cliente_Delete");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while deleting customer: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar el cliente");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("FindById/{id}")]
        public async Task<IActionResult> FindById(int id)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Ventas.Cliente_Get_Id");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while getting customer find by id: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de cliente");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
