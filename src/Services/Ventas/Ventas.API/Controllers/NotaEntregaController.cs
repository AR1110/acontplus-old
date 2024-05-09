using Autofac.Core;
using Azure.Core;
using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Extensions;
using Services.Common.Logs;
using Ventas.API.Interfaces;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Ventas.API.Controllers
{
    public class NotaEntregaController : BaseApiController
    { 
        private readonly INotaEntregaService _svc;
        private readonly ICustomLogger _log;
        public NotaEntregaController( INotaEntregaService svc, ICustomLogger log)
        { 
            _svc = svc;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _svc.GetAsync(new Dictionary<string, object> { { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null) { return NoContent(); };
                return Ok(new { code = "1", payload = response });
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar nota entregas: \n" + ex.ToString());
                return BadRequest("Error on get: " + ex.Message);
            }
        }

        [HttpGet("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            try
            {
                var response = await _svc.GetByIdAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "id", id } });
                if (response == null) { return NoContent(); };
                return Ok(new { code = "1", payload = response });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener datos de la nota de entrega: \n" + ex.ToString());
                return BadRequest("Error on get by id: " + ex.Message);
            }
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert(ApiRequest data)
        {
            var parameters = new Dictionary<string, object>
            {
                {"userRoleId", User.GetUserRoleId()},
                {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
            };
            var response = await _svc.AddAsync(parameters); 
            return Ok(response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, ApiRequest request)
        {
            var parameters = new Dictionary<string, object>
            {
                {"userRoleId", User.GetUserRoleId()},
                {"id", id},
                {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data))}
            };
            var response = await _svc.UpdateAsync(parameters);
            return Ok(response); 
             
        }


        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var parameters = new Dictionary<string, object>
            {
                {"idRol", User.GetUserRoleId()},
                {"id", id}, 
            };
            var response = await _svc.DeleteAsync(parameters);
            return Ok(response); 
        }

        [HttpPost("ConvertToDoc")]
        public async Task<IActionResult> ConvertToDoc(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>
            {
                {"userRoleId", User.GetUserRoleId()},
                {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data))}
            };
            var response = await _svc.ConvertToDocAsync(parameters);
            return Ok(response); 
        }
    }
}
