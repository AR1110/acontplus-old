using Common.Core.Models;
using Common.Core.Models.Config;
using Common.Core.Utils;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace WebUI.Controllers.Config
{
    public class GestionSistemaController : Controller
    {
        // GET: Articulo
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0

        GenericResponse _gr = new();

        public GestionSistemaController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Config.GestionSistema_Get");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    response = _db.GetDataTableAsync();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] GestionSistema data)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Config.GestionSistema_Update");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("id", id);
                    _db.AddDynamicParam("idTipoIva", data.idTipoIva);
                    _db.AddDynamicParam("idCliente", data.idCliente);
                    _db.AddDynamicParam("idArticulo", data.idArticulo);
                    _db.AddDynamicParam("idMetodoValoracion", data.idMetodoValoracion);
                    _db.AddDynamicParam("llevaInventario", data.llevaInventario);
                    _db.AddDynamicParam("searchCode", data.searchCode);
                    _db.AddDynamicParam("printerAutomatic", data.searchCode);
                    _db.AddDynamicParam("payAutomatic", data.payAutomatic);
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
