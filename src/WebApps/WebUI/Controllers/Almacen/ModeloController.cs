using Common.Core.Models;
using Common.Infrastructure.Repository.Almacen;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Almacen
{
    public class ModeloController : Controller
    {
        // GET: Modelo
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0


        GenericResponse _gr = new();
        private ModeloDao _m;


        public ModeloController(IConfiguration configuration)
        {
            _configuration = configuration;

            _m = new ModeloDao(_configuration);


        }



        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> GetBy()
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _m.OptionAsync(idRol);
            return Ok(_gr);
        }
    }
}