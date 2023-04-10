using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace WebUI.Controllers
{
    public class ActividadEmpresaController : Controller
    {
        private ActividadEmpresaDao _ae;
        private readonly IConfiguration _configuration;
        public ActividadEmpresaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ae = new ActividadEmpresaDao(_configuration);
        }
        // GET: ActividadEmpresa         

        
        public IActionResult Index()
        {
            return View();
        }

        //public IActionResult Get()
        //{
        //    int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        //    var res = _ae.GetAllAsync(idRol);
        //    return Ok(res);
        //}

        //Listamos en modulo sucursal 
        public IActionResult GetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = _ae.GetAllAsync(idRol);
            return Ok(res);
        }

        //Listamos para agregar etiquetas  y para articulos 
        public IActionResult GetBySucursal()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = _ae.GetBySucursalAsync(idRol);
            return Ok(res);
        }
    }
}