using DataAccess;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace WebUI.Controllers
{
    public class ActividadEmpresaController : Controller
    {
        // GET: ActividadEmpresa        
        readonly ActividadEmpresaDao _ae = new();

        [Authorize]
        public IActionResult Index()
        {
            return View();
        }

        //public IActionResult Get()
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        //    var res = _ae.GetAllAsync(idRol);
        //    return Ok(res);
        //}

        //Listamos en modulo sucursal 
        public IActionResult GetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = _ae.GetAllAsync(idRol);
            return Ok(res);
        }

        //Listamos para agregar etiquetas  y para articulos 
        public IActionResult GetBySucursal()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = _ae.GetBySucursalAsync(idRol);
            return Ok(res);
        }
    }
}