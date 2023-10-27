using DataAccess;
using Domain.Dtos;
using Lib.Common;
using Lib.Common.Api;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Inventario.API.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
    public class ArticuloController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public ArticuloController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }


        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Inventario.Articulo_Get");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar articulos: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar articulos");
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

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Id");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in articulo getId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos del articulo");
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
                await _db.SPExecute("Sistema.Almacen_Get_Data_Form");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al obtener datos del form-articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos del form-articulo");
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
                await _db.SPExecute("Almacen.Articulo_Get_Search");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error on Get Search: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener las bodegas");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpPost("Post")]
        public async Task<IActionResult> Post([FromBody] RequestApiDto parameters)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);

            try
            {
                await _db.SPExecute("Almacen.Articulo_Insert_v2");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(Converters.SerializeDictionary(parameters.data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al insertar articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Put/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RequestApiDto parameters)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Articulo_Update_v2");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(Converters.SerializeDictionary(parameters.data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al actualizar articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar articulo");
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
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Articulo_Delete");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al eliminar articulo: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
