using DataAccess;
using DataAccess.Almacen;
using Domain.Models;
using Domain.Models.Almacen;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class ModeloController : Controller
    {
        // GET: Modelo
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        GenericResponse _gr = new();
        private ModeloDao _m;


        public ModeloController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _m = new ModeloDao(_configuration);


        }



        public IActionResult Index()
        {
            return View();
        }        

        public async Task<IActionResult> GetBy()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _m.OptionAsync(idRol);
            return Ok(_gr);
        }
    }
}