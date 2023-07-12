using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Services.Common.Logs;
using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;

namespace ApiVentas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatalogoVentaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public CatalogoVentaController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet()]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Ventas.Catalogo_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al obtener catalogo venta: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener catalogo venta");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}