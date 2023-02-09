//using DataAccess;
//using Domain.Models;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Authorization;

//namespace WebUI.Controllers
//{
//    public class ComposicionArticuloDetalleController : Controller
//    {
//        // GET: ComposicionArticuloDetalle
//        GenericResponse _gr = new();
//        readonly ComposicionArticuloDetalleDao _cad = new();
//        [Authorize]
//        public IActionResult Index()
//        {
//            return View();
//        }

//        [HttpPost]
//        public async Task<IActionResult> CreateComposicionArticuloDetalle([FromBody]ComposicionArticuloDetalleOperaciones data)
//        {            
//            _gr = await _cad.CreateComposicionArticuloDetalleAsync(data);
//            return Ok(_gr);
//        }

//        [HttpPost]
//        public async Task<IActionResult> ReadComposicionArticuloDetalle([FromBody] ComposicionArticuloDetalleOperaciones data)
//        {
//            _gr = await _cad.ReadComposicionArticuloDetalleAsync(data);
//            return Ok(_gr);
//        }

//        [HttpPost]
//        public async Task<IActionResult> UpdateComposicionArticuloDetalle([FromBody]ComposicionArticuloDetalleOperaciones data)
//        {            
//            _gr = await _cad.UpdateComposicionArticuloDetalleAsync(data);
//            return Ok(_gr);
//        }

//        [HttpPost]
//        public async Task<IActionResult> DeleteComposicionArticuloDetalle([FromBody]ComposicionArticuloDetalleOperaciones data)
//        {            
//            _gr = await _cad.DeleteComposicionArticuloDetalleAsync(data);
//            return Ok(_gr);
//        }


//    }
//}