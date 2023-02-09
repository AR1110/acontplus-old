using BL.Admin.Data;
using Domain.Admin.Models;
using Microsoft.AspNetCore.Mvc;

namespace AdminUI.Controllers
{
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly ILogger<MenuController> _logger;
        private readonly IConfiguration _config;
        private MenuService _mS;
        public MenuController(ILogger<MenuController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _mS = new MenuService(_config);
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _mS.GetAsync(json));
        }

        [HttpGet]
        [Route("GetId/{id}")]
        public IActionResult GetId(string id)
        {
            return Ok();
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _mS.GetAllAsync());
        }

        [HttpPost]
        [Route("Post")]
        public async Task<IActionResult> Post([FromBody] Menu data)
        {
            return Ok(await _mS.PostAsync(data));
        }

        [HttpPut]
        [Route("Put")]
        public async Task<IActionResult> Put(string id, [FromBody] Menu data)
        {
            return Ok(await _mS.PutAsync(id, data));
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> Put(string id)
        {
            return Ok(await _mS.DeleteAsyn(id));
        }
    }
}