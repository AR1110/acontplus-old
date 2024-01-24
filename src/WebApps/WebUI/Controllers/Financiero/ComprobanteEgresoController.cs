using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace WebUI.Controllers.Financiero
{
    public class ComprobanteEgresoController : Controller
    {
        private readonly IConfiguration _configuration;



        public ComprobanteEgresoController(IConfiguration configuration)
        {
            _configuration = configuration;

        }


        public IActionResult Index()
        {
            return View();
        }


        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var response = new ApiResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("GestFinanc.ComprobanteEgreso_Get");
                    _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
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

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CobroPago data)
        {
            var response = new ApiResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("GestFinanc.ComprobanteEgreso_Insert");
                    _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
                    _db.AddDynamicParam("comprobante", SqlStringParam.Sanitize(data.comprobante));
                    _db.AddDynamicParam("pagos", SqlStringParam.Sanitize(data.cobrosPagos));
                    _db.AddDynamicParam("pagoDetalle", SqlStringParam.Sanitize(data.detalles));
                    _db.AddDynamicParam("historial", SqlStringParam.Sanitize(data.historial));
                    response = _db.GetDefault();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public async Task<IActionResult> Cancel(int id, string observacion)
        {
            var response = new ApiResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("GestFinanc.ComprobanteEgreso_Update_Cancel");
                    _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
                    _db.AddDynamicParam("idComprobanteEgreso", id);
                    _db.AddDynamicParam("observacion", observacion);
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
