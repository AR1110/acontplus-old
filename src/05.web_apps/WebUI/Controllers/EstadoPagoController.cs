using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class EstadoPagoController : Controller
    {
        private readonly IConfiguration _configuration;
        private EstadoDocumentoDao _eDoc;   
        public EstadoPagoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _eDoc = new EstadoDocumentoDao(_configuration);
        }

        
        public ActionResult Index()
        {
            return View();
        }
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _eDoc.GetAsync(json));
        }

        //public async Task<IActionResult> Post(EstadoPago data)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        //    var response = await new EstadoPagoDao().InsertAsync(idRol, data);
        //    return Ok(response);
        //}
        //public async Task<IActionResult> Put(int id, EstadoPago data)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        //    var response = await new EstadoPagoDao().UpdateAsync(idRol, id, data);
        //    return Ok(response);
        //}
        //public async Task<IActionResult> Delete(int id)
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        //    var response = await new EstadoPagoDao().DeleteAsync(idRol, id);
        //    return Ok(response);
        //}
    }
}
