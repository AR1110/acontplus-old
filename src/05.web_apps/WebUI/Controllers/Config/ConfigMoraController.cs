using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Config
{
    public class ConfigMoraController : Controller
    {
        GenericResponse _gr = new();
        ConfiguracionMoraDao _cm = new();
        [Authorize]
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
