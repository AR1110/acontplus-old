using DataAccess;
using Domain.ViewModels.Ventas;
using Lib.Common;
using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Logs;

namespace ApiFactElect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotaCreditoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public NotaCreditoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {

            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.NotaCredito_Get", true);
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener datos de nota credito: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de nota credito");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.NotaCredito_Get_Id", true);
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener datos de nota credito: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de nota credito");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response); 

        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] NotaCreditoViewModel data)
        {

            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.NotaCredito_Insert", true);
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("jsonNotaCredito", JsonConvert.SerializeObject(data.nota));
                _db.AddDynamicParam("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
                _db.AddDynamicParam("jsonInfoAdicional", JsonConvert.SerializeObject(data.adicional)); 
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear el Doc. Nota Credito: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al crear el Dic");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] NotaCreditoViewModel data)
        { 
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.NotaCredito_Update", true);
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("jsonNotaCredito", JsonConvert.SerializeObject(data.nota));
                _db.AddDynamicParam("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
                _db.AddDynamicParam("jsonInfoAdicional", JsonConvert.SerializeObject(data.adicional)); 
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Update nota credito: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar nota credito");
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
            try
            {
                await _db.SPExecute("Ventas.NotaCredito_Delete", true);
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar nota credito: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar nota credito");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
