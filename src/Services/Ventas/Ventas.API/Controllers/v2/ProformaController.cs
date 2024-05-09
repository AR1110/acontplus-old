 
using Asp.Versioning; 
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Extensions;
using Ventas.API.Interfaces;

namespace Ventas.API.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
    public class ProformaController : ControllerBase
    {
        private readonly IProformaService _svc;

        public ProformaController(IProformaService svc)
        {
            _svc = svc;
        }

        [HttpPost("ConvertToDoc")]
        public async Task<IActionResult> ConvertToDoc(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(JsonConvert.SerializeObject(request.Data)) }
            };
            var response = await _svc.ConvertToDoc(parameters); 
            return Ok(response);
        }
    }

   
}
