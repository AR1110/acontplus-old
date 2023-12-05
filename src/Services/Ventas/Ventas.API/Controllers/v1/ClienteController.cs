using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common;
using Services.Common.Logs;

namespace Ventas.API.Controllers.v1
{
    [Route("api/cliente/[action]")]
    [ApiController]
    [ApiVersion("1.0")]
    public class ClienteController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public ClienteController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Cliente_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
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

        //Eliminar mas adelante
        [HttpGet]
        public async Task<IActionResult> GetDataForm(string json)
        {

            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

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

        [HttpGet]
        public async Task<IActionResult> Search(string json)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                if (!DataValidation.IsValidJson(json))
                {
                    return BadRequest("Caracteres de busqueda invalidos");
                }
                await _db.SPExecute("Ventas.Cliente_Get_Search");
                _db.AddDynamicParam("idRol ", User.GetUserRoleId());
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error while searching data form customer: {json} " + ex.ToString());
                _response.Create(code: "0", message: "Error al buscar cliente");
            }
            finally { _db.Close(); }
            return Ok(_response);
        }


        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] Cliente data)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
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

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Cliente data)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
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

        [HttpGet("{id}")]
        public async Task<IActionResult> FindById(int id)
        {
            var _response = new GenericResponse();
            var _db = new DbAccess(_configuration);
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
