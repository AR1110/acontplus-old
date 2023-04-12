using DataAccess;
using DataAccess.Logistica;
using Domain.Models;
using Domain.Models.Logistica;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Logistica
{
    public class VehiculoController : Controller
    {
        private readonly IConfiguration _configuration;
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        
        GenericResponse _gr = new();
        
        private VehiculoDao _v;
        public VehiculoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _v = new VehiculoDao(_configuration);
            
            _dao = new DataAccessObject(_configuration);
            
            

        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Vehiculo data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _v.InsertAsync(idRol, data);
            return Ok(res);
        }
        public async Task<IActionResult> Get()
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _v.GetAsync(idRol);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Put(int id, [FromBody] Vehiculo data){
            
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("idVehiculo", id);
            parameters.Add("placa", data.placa);
            parameters.Add("marca", data.marca);
            parameters.Add("modelo", data.modelo);
            parameters.Add("observacion", DataHelper.ToDBNullOrDefault(data.observacion));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Logistica.Vehiculo_Update", parameters)));
        }

        public async Task<IActionResult> Delete(int id)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _v.DeleteAsync(idRol, id);
            return Ok(res);
        }

        //Search 
        public async Task<IActionResult> Search(string text)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _v.SearchAsync(idRol, text);
            return Ok(res);
        }
    }
}
