using BL.Admin.Data;
using Microsoft.AspNetCore.Mvc;


namespace ApiAdmin.Controllers
{
    [Route("api/[controller]")]
    public class SubMenuController : ControllerBase
    {
        private readonly ILogger<SubMenuController> _logger;
        private readonly IConfiguration _config;
        private SubMenuService _smSvc;
        public SubMenuController(ILogger<SubMenuController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _smSvc = new SubMenuService(_config);
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _smSvc.GetAsync(json));
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post(string json)
        {
            return Ok(await _smSvc.PostAsync(json));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, string json)
        {
            return Ok(await _smSvc.PutAsync(id, json));
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return Ok(await _smSvc.DeleteAsync(id));
        }

        [HttpGet]
        [Route("GetSubMenuByMenu/{idMenu}")]
        public async Task<IActionResult> GetSubMenuByMenu(string idMenu)
        {
            return Ok(await _smSvc.GetSubMenuByMenu(idMenu));
        }
    }
}