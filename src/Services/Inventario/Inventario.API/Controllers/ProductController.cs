using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Models;
using Common.Core.Utils;
using Inventario.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Extensions;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;
        private readonly ICustomLogger _log;

        public ProductController(IProductService service, ICustomLogger log)
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
                _log.LogActivity("Error en get product" + ex.Message + '\n' + json);
                return BadRequest("Error en get product " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post(ApiRequest request)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json",  SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data))}
                };
                var response = await _service.UpdateAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en add Precio Masivo" + ex.Message + "\n");
                return BadRequest("Error en insert Precio Masivo " + ex.Message);
            }
        }

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
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Put Precio Masivo" + ex.Message + "\n");
                return BadRequest("Error en Actualizar Precio Masivo " + ex.Message);
            }
        }
    }
}
