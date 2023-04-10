using Domain.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using DataAccess;
using Helpers;

namespace WebUI.Controllers
{
    public class SubContribuyenteController : Controller
    {
        // GET: SubContribuyente
        private readonly IConfiguration _config;
        private readonly string _connectionStrings = string.Empty;
        GenericResponse _gr = new();
        private SubContribuyenteDao _sc;

        public SubContribuyenteController(IConfiguration config)
        {
            _config = config;
            _sc = new SubContribuyenteDao(_config);
        }

        
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]SubContribuyenteOperaciones data)
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _sc.CreateSubContribuyenteAsync(idRol, data);
            return Ok(_gr);
        }

        
        public IActionResult GetByIdTipoContribuyente(int idTipoContribuyente)
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = _sc.ReadSubContribuyente(idRol, idTipoContribuyente);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Put([FromBody]SubContribuyenteOperaciones data)
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _sc.UpdateSubContribuyenteAsync(idRol, data);
            return Ok(_gr);
        }

        
        public async Task<IActionResult> Delete(int idSubContribuyente)
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _sc.DeleteSubContribuyenteAsync(idRol, idSubContribuyente);
            return Ok(_gr);
        }

        //Listar Sub Contribuyente para agregar  Agregar Configuración Contribuyente
        public async Task<IActionResult> OptionSubContribuyente()
        {
             int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _sc.OptionSubContribuyenteAsync(idRol);
            return Ok(_gr);
        }

    }
}