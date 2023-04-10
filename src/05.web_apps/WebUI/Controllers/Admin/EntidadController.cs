using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace WebUI.Controllers
{
    public class EntidadController : Controller
    {
        private readonly IConfiguration _configuration;

        readonly EntidadDao _e;        
        public EntidadController(IConfiguration configuration)
        {
            _configuration = configuration;
            _e = new EntidadDao(_configuration);
        }
        // GET: Entidad
        
        public IActionResult Index()
        {            
            return View();
        }

        public async Task<IActionResult> OptionEntidad()
        {
           int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
           var res = await _e.OptionAsync(idRol);
           return Ok(res);
        }
       

        //OTHER METHODS
        public async Task<IActionResult> GetAll()
        {
           int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var response = await _e.OptionAsync(idRol);
           return Ok(response);
        }
    }
}