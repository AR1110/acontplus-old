using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DataAccess;
using Helpers;

namespace WebUI.Controllers
{
    public class TipoArticuloController : Controller
    {
        // GET: TipoArticulo
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private TipoArticuloDao ta;

        public TipoArticuloController(IConfiguration config)
        {
            _config = config;
            ta = new TipoArticuloDao(_config);
        }

        
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult ReadTipoArticulo()
        {
            _gr = ta.ReadTipoArticulo();
            return Ok(_gr);
        }


    }
}