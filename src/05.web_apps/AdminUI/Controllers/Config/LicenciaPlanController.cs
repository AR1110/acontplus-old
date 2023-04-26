using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class LicenciaPlanController : ControllerBase
    {
        private readonly ILogger<LicenciaPlanController> _logger;
        private readonly IConfiguration _config;
        private LicenciaPlanService _lpS;
        public LicenciaPlanController(ILogger<LicenciaPlanController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _lpS = new LicenciaPlanService(_config);
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _lpS.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] LicenciaPlan data)
        {
            return Ok(await _lpS.PostAsync(data));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, [FromBody] LicenciaPlan data)
        {
            return Ok(await _lpS.PutAsync(id, data));
        }


        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _lpS.DeleteAsync(id));
        }
    }
}