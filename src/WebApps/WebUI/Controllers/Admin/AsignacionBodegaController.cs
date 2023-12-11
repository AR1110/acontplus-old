using Common.Core.Models.Administracion;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Admin
{
    public class AsignacionBodegaController : Controller
    {
        private readonly IConfiguration _configuration;
        private AsignacionBodegaDao _asignB;
        public AsignacionBodegaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _asignB = new AsignacionBodegaDao(_configuration);
        }


        public IActionResult Index()
        {
            return View();
        }



        /* const json = {  
            typeList: 0,          
            idAsignacionSucursal: item.idAsignacionSucursal
        }
        */
        public async Task<IActionResult> Get(string json)
        {
            return Ok(await _asignB.GetAsync(json));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] AsignacionBodega data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            return Ok(await _asignB.InsertAsync(idRol, data));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            return Ok(await _asignB.UpdateAsync(idRol, id));
        }

    }
}
