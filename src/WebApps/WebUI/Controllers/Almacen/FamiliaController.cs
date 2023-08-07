using DataAccess;
using DataAccess.Almacen;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class FamiliaController : Controller
    {
        // GET: Familia
        private readonly IConfiguration _configuration;

        private DataAccessObject _dao;
        GenericResponse _gr = new();
        private FamiliaDao _f;

        public FamiliaController(IConfiguration configuration)
        {
            _configuration = configuration;

            _dao = new DataAccessObject(_configuration);
            _f = new FamiliaDao(_configuration);
        }


        public IActionResult Index()
        {
            return View();
        }


        //Operaciones Especiales 
        public async Task<IActionResult> GetBy()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _f.OptionAsync(idRol);
            return Ok(_gr);
        }

        //Creo uno nuevo metodo "GetAll" q se esta usando en uibModal SubFamilia,  
        public async Task<IActionResult> GetAll()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _f.OptionAsync(idRol);
            return Ok(_gr);
        }
    }
}