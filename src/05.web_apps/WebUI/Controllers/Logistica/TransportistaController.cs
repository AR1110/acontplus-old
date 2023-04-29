using DataAccess;
using DataAccess.Logistica;
using Domain.Models;
using Domain.Models.Logistica;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Logistica
{
    public class TransportistaController : Controller
    {
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        GenericResponse _gr = new();

        private TransportistaDao _trans = new();
        public TransportistaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _trans = new TransportistaDao(_configuration);

            _dao = new DataAccessObject(_configuration);


        }
        public ViewResult Index()
        {
            return View();
        }

        /*
         const json = {
            typeList: 0, --Lista Normal 
            typeList: 1 => Para lISTAR EN SELECT HTML
            typeList: 2 => Para buscadores(autocomplete)
        }
         */
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _trans.GetAsync(idRol, json);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Transportista data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _trans.InsertAsync(idRol, data);
            return Ok(res);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] Transportista data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("idTransportista", id);
            parameters.Add("nroIdentificacion", data.nroIdentificacion);
            parameters.Add("nombre", data.nombre);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Logistica.Transportista_Update", parameters)));

        }

        public async Task<IActionResult> Delete(int id)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _trans.DeleteAsync(idRol, id);
            return Ok(res);
        }
    }
}
