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
    public class FormaPagoSriController : Controller
    {
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private FormaPagoSriDao _fp;

        public FormaPagoSriController(IConfiguration config)
        {
            _config = config;
            _fp = new FormaPagoSriDao(_config);
        }

        
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> OptionFormaPagoSri()
        {
            var res = await _fp.OptionFormaPagoSriAsync();
            return Ok(res);

        }
    }
}
