using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Inventario.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrecioMasivoController : ControllerBase
    {
        private readonly IPrecioMasivoService _service;
        private readonly ICustomLogger _log;

        public PrecioMasivoController(IPrecioMasivoService service, ICustomLogger log)
        {
            _service = service;
            _log = log;
        } 
        [HttpGet]
        public async Task<ActionResult<ApiResponse>> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(json)}
                };
                var response = await _service.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en get Precio Masivo" + ex.Message +'\n' + json);
                return BadRequest("Error en get Precio Masivo " + ex.Message);
            } 
        }

        //[HttpPost]
        //public async Task<ActionResult<ApiResponse>> Post(ApiRequest parameters)
        //{
        //    DbAccess _db = new DbAccess(_configuration);
        //    ApiResponse _response = new ApiResponse();
        //    try
        //    {
        //        await _db.SPExecute("Inventario.PrecioMasivo_Insert");
        //        _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
        //        _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.Data));
        //        _response = _db.GetDefault();
        //    }
        //    catch (Exception ex)
        //    {

        //        _log.LogActivity("Error on Post: \n" + ex.ToString());
        //        _response.Create(code: "0", message: "Error al guardar");
        //    }
        //    finally
        //    {
        //        _db.Close();
        //    }
        //    return _response;
        //}
        [HttpPut]
        public async Task<ActionResult> Put(ApiRequest request)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json",  SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data))}
                };
                var response = await _service.UpdateAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Put Precio Masivo" + ex.Message + "\n" );
                return BadRequest("Error en Actualizar Precio Masivo " + ex.Message);
            } 
        }
    }
}
