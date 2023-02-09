using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers
{
    public class TipoPersonaController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TipoPersonaDao _tp;

        public TipoPersonaController(IConfiguration config)
        {
            _config = config;
            _tp = new TipoPersonaDao(_config);
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> ReadTipoPersona()
        {
            _gr = await _tp.ReadTipoPersonaAsync();
            return Ok(_gr);
        }
    }
}
