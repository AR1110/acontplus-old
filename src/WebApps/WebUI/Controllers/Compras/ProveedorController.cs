using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using DataAccess.Compras;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers.Compras
{
    public class ProveedorController : Controller
    {
        // GET: Proveedor
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        GenericResponse _gr = new();
        private PersonaDao p;
        private ProveedorDao _prov;

        public ProveedorController(IConfiguration configuration)
        {
            _configuration = configuration;
            p = new PersonaDao(_configuration);
            _prov = new ProveedorDao(_configuration);
            _dao = new DataAccessObject(_configuration);



        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlStringParam.Sanitize(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Compra.Proveedor_Get", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Proveedor data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _prov.InsertAsync(idRol, data);
            return Ok(res);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] Proveedor data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _prov.UpdateAsync(idRol, id, data);
            return Ok(res);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _prov.DeleteAsync(idRol, id);
            return Ok(res);
        }

        //Gestiones Especiales 
        [HttpPost]
        public async Task<IActionResult> SearchPersona([FromBody] HelpersResponse data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await p.SearchPersonaAsync(idRol, data);
            return Ok(_gr);
        }


        //Buscador proveedor por Nombre Comercial o RUC
        public async Task<IActionResult> SearchProveedor(string busqueda)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _prov.SearchProveedorAsync(idRol, busqueda);
            return Ok(_gr);
        }

        //Traer Datos del Proveedor por id Provedor
        public async Task<IActionResult> SearchProveedorId(int idProveedor)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var response = await _prov.GetIdAsync(idRol, idProveedor);
            return Ok(response);
        }

        //Traer Datos del Proveedor por id Provedor
        public async Task<IActionResult> GetId(int idProveedor)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var response = await _prov.GetIdAsync(idRol, idProveedor);
            return Ok(response);
        }

    }
}
