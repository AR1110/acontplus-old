using Common.Core.Models;
using Common.Core.Models.Almacen;
using Common.Infrastructure.Repository;
using Common.Infrastructure.Repository.Almacen;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace WebUI.Controllers.Almacen
{
    public class CodigoBarraArticuloController : Controller
    {
        private readonly IConfiguration _configuration;
        // GET: CodigoBarraArticulo 

        private ArticuloCodigoBarraDao _cba;
        GenericResponse _gr = new();
        public CodigoBarraArticuloController(IConfiguration configuration)
        {
            _configuration = configuration;

            _cba = new ArticuloCodigoBarraDao(_configuration);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(int idArticulo)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _cba.GetIdAsync(idArticulo);
            return Ok(_gr);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ArticuloCodigoBarra data)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Almacen.CodigoBarra_Insert");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("idArticulo", data.idArticulo);
                    _db.AddDynamicParam("idMedida", data.idMedida);
                    _db.AddDynamicParam("codigoBarra", data.codigoBarra);
                    _db.AddDynamicParam("descripcion", data.descripcion);
                    _db.AddDynamicParam("color", data.color ?? "");
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Put(int idArticuloCodigoBarra, [FromBody] ArticuloCodigoBarra data)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Almacen.CodigoBarra_Update");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("id", idArticuloCodigoBarra);
                    _db.AddDynamicParam("idMedida", data.idMedida);
                    _db.AddDynamicParam("codigoBarra", data.codigoBarra);
                    _db.AddDynamicParam("descripcion", data.descripcion);
                    _db.AddDynamicParam("color", data.color ?? "");
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        public async Task<IActionResult> Delete(int idArticuloCodigoBarra)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Almacen.CodigoBarra_Delete");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("id", idArticuloCodigoBarra);
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
