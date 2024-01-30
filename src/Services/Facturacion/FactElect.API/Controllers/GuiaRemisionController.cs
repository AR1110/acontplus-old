using Autofac.Core;
using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using FactElect.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace FactElect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuiaRemisionController: BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IGuiaRemisionService _svc;
        private readonly LogWriter _log;
        public GuiaRemisionController(IConfiguration configuration, IGuiaRemisionService service, LogWriter log)
        {
            _configuration = configuration;
            _svc = service;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(json)}
                };
                var response = await _svc.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en get Guia Remision" + ex.Message);
                return BadRequest("Error en get Guia Remision" + ex.Message);
            }
        }

        [HttpGet("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id}
                };
                var response = await _svc.GetByIdAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(new { code = "1", payload = response });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener datos de la nota de entrega: \n" + ex.ToString());
                return BadRequest("Error on get by id: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };
                var response = await _svc.AddAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Post Guia Remision" + ex.Message);
                return BadRequest("Error en Post Guia Remision" + ex.Message);
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                     { "id", id },
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };
                var response = await _svc.UpdateAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Put Guia Remision" + ex.Message);
                return BadRequest("Error en Actualizar Guia Remision " + ex.Message);
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id}
                };
                var response = await _svc.DeleteAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al anular Guia Remision: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

    }
}
