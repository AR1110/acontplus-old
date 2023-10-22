using DataAccess;
using DataAccess.Almacen;
using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Almacen
{
    public class MarcaController : Controller
    {
        // GET: Marca
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        GenericResponse _gr = new();
        private MarcaDao _m;

        public MarcaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
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