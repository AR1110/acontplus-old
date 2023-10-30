using Common.Core.Models;
using DataAccess.Almacen;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Almacen
{
    public class FamiliaController : Controller
    {
        // GET: Familia
        private readonly IConfiguration _configuration;


        GenericResponse _gr = new();
        private FamiliaDao _f;

        public FamiliaController(IConfiguration configuration)
        {
            _configuration = configuration;


            _f = new FamiliaDao(_configuration);
        }


        public IActionResult Index()
        {
            return View();
        }


        //Operaciones Especiales 
        public async Task<IActionResult> GetBy()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _f.OptionAsync(idRol);
            return Ok(_gr);
        }

        //Creo uno nuevo metodo "GetAll" q se esta usando en uibModal SubFamilia,  
        public async Task<IActionResult> GetAll()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _f.OptionAsync(idRol);
            return Ok(_gr);
        }
    }
}