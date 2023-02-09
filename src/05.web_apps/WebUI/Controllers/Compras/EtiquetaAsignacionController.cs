//using DataAccess;
//using Microsoft.AspNetCore.Mvc;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace WebUI.Controllers.Compras
//{
//    public class EtiquetaAsignacionController : Controller
//    {
//        EtiquetaAsignacionDao _ea = new();  
//        public IActionResult Index()
//        {
//            return View();
//        }

//        public async Task<IActionResult> Get()
//        {
//            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
//            var res = await _ea.GetAsync(idRol);
//            return Ok(res);
//        }

//        public async Task<IActionResult> GetEtiquetaAsigId(int idEtiqueta)
//        {
//            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
//            var res = await _ea.GetIdAsync(idRol, idEtiqueta);
//            return Ok(res); 
//        }
//    }
//}
