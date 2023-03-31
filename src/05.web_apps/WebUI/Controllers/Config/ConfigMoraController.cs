using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Config
{
    public class ConfigMoraController : Controller
    {
        private readonly IConfiguration _configuration;

        GenericResponse _gr = new();
        private ConfiguracionMoraDao _cm;
        public ConfigMoraController(IConfiguration configuration)
        {
            _configuration = configuration; 
            _cm = new ConfiguracionMoraDao(_configuration);
        }

        
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ConfiguracionMora data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _cm.CreateConfiguracionMoraAsync(idRol, data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Get()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _cm.ReadConfiguracionMoraAsync(idRol);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody] ConfiguracionMora data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _cm.UpdateConfiguracionMoraAsync(idRol, data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Delete(int idConfigMora)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _cm.DeleteConfiguracionMoraAsync(idRol, idConfigMora);
            return Ok(_gr);
        }
    }
}
