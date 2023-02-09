using DataAccess.Aplicacion;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace WebUI.Controllers.Api
{
    [AllowAnonymous]
    [Route("apiCliente/[controller]")]
    [ApiController]
    public class RolController : ControllerBase
    {
        private readonly ILogger<RolController> _logger;
        readonly RolDao _rd = new();
        public RolController(ILogger<RolController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _rd.GetAsync(json));
        }

        [HttpPost]
        [Route("Post/{json}")]
        public async Task<IActionResult> Post(string json)
        {
            AppRol appRol = JsonConvert.DeserializeObject<AppRol>(json);
            return Ok(await _rd.InsertAsync(appRol));
        }

        [HttpPut]
        [Route("Put/{codigo}/{descripcion}")]
        public async Task<IActionResult> Put(string codigo, string descripcion)
        {
            return Ok(await _rd.UpdateAsync(codigo, descripcion));
        }

        [HttpDelete]
        [Route("Delete/{codigo}")]
        public async Task<IActionResult> Delete(string codigo)
        {
            return Ok(await _rd.DeleteAsync(codigo));
        }
    }
}
