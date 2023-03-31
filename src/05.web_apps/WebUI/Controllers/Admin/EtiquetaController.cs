using DataAccess;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Controllers.Admin
{
    public class EtiquetaController : Controller
    {
        private readonly IConfiguration _config;
        private EtiquetaDao _e;
        public EtiquetaController(IConfiguration config, EtiquetaDao e)
        {
            _config = config;
            _e = new EtiquetaDao(_config);
        }

        
        public IActionResult Index()
        {
            ViewData["idRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return View();
        }
        public async Task<IActionResult> Get(string json)
        {            
            var res = await _e.GetAsync(json);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Post(int idActividad, [FromBody] List<Etiqueta> data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _e.InsertAsync(idRol, idActividad, data);
            return Ok(res);
        }




        //[HttpPost]
        //public async Task<IActionResult> Put(int idEtiqueta, [FromBody] EtiquetaViewModel data)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var res = await _e.UpdateAsync(idRol, idEtiqueta, data);
        //    return Ok(res);
        //}


        //public async Task<IActionResult> Delete(int idEtiqueta)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var res = await _e.DeleteAsync(idRol, idEtiqueta);
        //    return Ok(res);
        //}


        ////Listar Etiquetas de acuerdo el Id Actividad Empresa  en el Doc. Compra para
        ////datos adicionales del Articulo 
        //public async Task<IActionResult> GetId(int idActividadEmpresa)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var res = await _e.GetIdAsync(idRol, idActividadEmpresa);
        //    return Ok(res);
        //}

    }
}
