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
    public class SustentoTributarioController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private SustentoTributarioDao _st;

        public SustentoTributarioController(IConfiguration config)
        {
            _config = config;
            _st = new SustentoTributarioDao(_config);
        }

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> ReadSustentoTributario()
        {
            var res = await _st.ReadSustentoTributarioAsync();
            return Ok(res);
        }

        public async Task<IActionResult> GetAll()
        {
            var res = await _st.ReadSustentoTributarioAsync();
            return Ok(res);

        }
    }
}
