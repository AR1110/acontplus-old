using DataAccess;
using DataAccess.Almacen;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class SubFamiliaController : Controller
    {
        //// GET: SubFamilia
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        GenericResponse _gr = new();
        private SubFamiliaDao _sf;

        public SubFamiliaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _sf = new SubFamiliaDao(_configuration);



        }


        public IActionResult Index()
        {
            return View();
        }

        //DEPURACION        
        public async Task<IActionResult> GetBy()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _sf.OptionAsync(idRol);
            return Ok(_gr);
        }
    }
}