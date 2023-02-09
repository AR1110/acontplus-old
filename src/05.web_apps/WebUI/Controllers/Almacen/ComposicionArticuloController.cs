//using DataAccess;
//using Domain.Models;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Authorization;

//namespace WebUI.Controllers
//{
//    public class ComposicionArticuloController : Controller
//    {
//        // GET: ComposicionArticulo
//        GenericResponse _gr = new();
//        readonly ComposicionArticuloDao ca = new();
//        [Authorize]
//        public IActionResult Index()
//        {
//            return View();
//        }

//        [HttpPost]
//        public async Task<IActionResult> CreateComposicionArticulo([FromBody] ComposicionArticuloOperaciones data, List<ComposicionArticuloDetalleOperaciones> dataDetalle)
//        {
//            _gr = await ca.CreateComposicionArticuloAsync(data, dataDetalle);
//            return Ok(_gr);
//        }

//        public async Task<IActionResult> ReadComposicionArticulo()
//        {
//            _gr = await ca.ReadComposicionArticuloAsync();
//            return Ok(_gr);
//        }

//        [HttpPost]
//        public async Task<IActionResult> UpdateComposicionArticulo([FromBody] ComposicionArticuloOperaciones data)
//        {
//            _gr = await ca.UpdateComposicionArticuloAsync(data);
//            return Ok(_gr);
//        }

//        [HttpPost]
//        public async Task<IActionResult> DeleteComposicionArticulo([FromBody] ComposicionArticuloOperaciones data)
//        {
//            _gr = await ca.DeleteComposicionArticuloAsync(data);
//            return Ok(_gr);
//        }


//    }
//}