using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using DataAccess.Almacen;
using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common;

namespace WebUI.Controllers.Almacen
{
    public class ArticuloFraccionadoController : Controller
    {
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0


        readonly ArticuloFraccionadoDao _af;

        public ArticuloFraccionadoController(IConfiguration configuration)
        {
            _configuration = configuration;

            _af = new ArticuloFraccionadoDao(_configuration);


        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Almacen.Fraccionado_Get");
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

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            var res = await _af.GetIdAsync(id);
            return Ok(res);
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ArticuloFraccionadoViewModel data)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Almacen.Fraccionado_Insert");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("idArticulo", data.fraccionado.idArticulo);
                    _db.AddDynamicParam("idMedida", data.fraccionado.idMedida);
                    _db.AddDynamicParam("conversion", data.fraccionado.conversion);
                    _db.AddDynamicParam("gestionVenta", data.fraccionado.gestionVenta);
                    _db.AddDynamicParam("precioCostoFraccionado", data.fraccionado.precioCostoFraccionado);
                    _db.AddDynamicParam("json", JsonConvert.SerializeObject(data.pvps));
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] ArticuloFraccionadoViewModel data)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Almacen.Fraccionado_Update");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("id", id);
                    _db.AddDynamicParam("idMedida", data.fraccionado.idMedida);
                    _db.AddDynamicParam("conversion", data.fraccionado.conversion);
                    _db.AddDynamicParam("gestionVenta", data.fraccionado.gestionVenta);
                    _db.AddDynamicParam("precioCostoFraccionado", data.fraccionado.precioCostoFraccionado);
                    _db.AddDynamicParam("estado", data.fraccionado.estado);
                    _db.AddDynamicParam("json", JsonConvert.SerializeObject(data.pvps));
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Almacen.Fraccionado_Delete");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("id", id);
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
