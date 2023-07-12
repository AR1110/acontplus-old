using DataAccess;
using DataAccess.Almacen;
using Domain.Models;
using Domain.Models.Almacen;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebUI.Controllers
{
    public class CodigoBarraArticuloController : Controller
    {
        private readonly IConfiguration _configuration;
        // GET: CodigoBarraArticulo 
        private DataAccessObject _dao;
        private ArticuloCodigoBarraDao _cba;
        GenericResponse _gr = new();
        public CodigoBarraArticuloController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _cba = new ArticuloCodigoBarraDao(_configuration);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(int idArticulo)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _cba.GetIdAsync(idArticulo);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ArticuloCodigoBarra data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("idArticulo", data.idArticulo);
            parameters.Add("idMedida", data.idMedida);
            parameters.Add("codigoBarra", data.codigoBarra);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("color", data.color ?? "");
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.CodigoBarra_Insert", parameters)));

        }

        [HttpPost]
        public async Task<IActionResult> Put(int idArticuloCodigoBarra, [FromBody] ArticuloCodigoBarra data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("id", idArticuloCodigoBarra);
            parameters.Add("idMedida", data.idMedida);
            parameters.Add("codigoBarra", data.codigoBarra);
            parameters.Add("descripcion", data.descripcion);
            parameters.Add("color", data.color ?? "");
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.CodigoBarra_Update", parameters)));
        }


        public async Task<IActionResult> Delete(int idArticuloCodigoBarra)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", idRol);
            parameters.Add("id", idArticuloCodigoBarra);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.CodigoBarra_Delete", parameters)));
        }
    }
}