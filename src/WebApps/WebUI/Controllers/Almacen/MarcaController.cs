using Common.Core.Models;
using Common.Infrastructure.Repository.Almacen;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Almacen
{
    public class MarcaController : Controller
    {
        // GET: Marca
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0


        GenericResponse _gr = new();
        private MarcaDao _m;

        public MarcaController(IConfiguration configuration)
        {
            _configuration = configuration;

            _m = new MarcaDao(_configuration);


        }


        public IActionResult Index()
        {
            return View();
        }

        //Operaciones Especiales 

        public async Task<IActionResult> ListMarca(int idMarca)
        {
            _gr = await _m.OptionAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), idMarca);
            return Ok(_gr);
        }

    }
}