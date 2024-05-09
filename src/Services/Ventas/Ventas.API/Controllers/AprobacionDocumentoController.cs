using Azure.Core;
using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Extensions;
using Services.Common.Logs;
using Ventas.API.Interfaces;

namespace Ventas.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AprobacionDocumentoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ICustomLogger _log;
        private readonly IAprobacionDocService _svc;
        public AprobacionDocumentoController(IConfiguration configuration, ICustomLogger log, IAprobacionDocService svc)
        {
            _configuration = configuration;
            _log = log;
            _svc = svc;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            var _response = new ApiResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Ventas.Aprob_Document_Get", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar aprob. docs: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar aprob. docs.");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>
            {
                {"userRoleId", User.GetUserRoleId()},
                {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data))}
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
                {"idUsuarioRol", User.GetUserRoleId()},
                {"id", id}, 
            };
            var response = await _svc.DeleteAsync(parameters);
            return Ok(response); 
        }

        [HttpGet("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            var _db = new DbAccess(_configuration);
            var _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Ventas.Aprob_Document_Get_Id");
                _db.AddDynamicParam("id", id);
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
