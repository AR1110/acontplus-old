using DataAccess;
using DataAccess.Almacen;
using Domain.Models;
using Domain.Models.Almacen;
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
       

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SubFamilia data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("idFamilia", data.idFamilia);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("siglas", data.siglas);
            parameters.Add("montoObjetivo", data.montoObjetivo);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.SubFamilia_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] SubFamilia data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("idFamilia", data.idFamilia);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("montoObjetivo", data.montoObjetivo);
            parameters.Add("estado", data.estado);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.SubFamilia_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.SubFamilia_Delete", parameters)));
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