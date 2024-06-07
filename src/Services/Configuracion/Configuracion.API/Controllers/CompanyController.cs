using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Configuracion.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompanyController : ControllerBase
    {
        private readonly ICustomLogger _log;
        private readonly ICompanyService _service;

        public CompanyController(ICompanyService service, ICustomLogger log)
        {
            _service = service;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        { 
                var parameters = new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
                };
                var response = await _service.GetAsync(parameters);
                return Ok(response); 
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest request)
        {
            
                var parameters = new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() },
                    { "id", id },
                    { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
                };
                var response = await _service.UpdateAsync(parameters);
                return Ok(response); 
        }
    }
}
