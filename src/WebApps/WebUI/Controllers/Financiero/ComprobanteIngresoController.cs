using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace WebUI.Controllers.Financiero
{
    public class ComprobanteIngresoController : Controller
    {
        private readonly IConfiguration _configuration;



        public ComprobanteIngresoController(IConfiguration configuration)
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
                    await _db.SPExecute("GestFinanc.ComprobanteIngreso_Get");
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

        [HttpDelete]
        public async Task<IActionResult> Cancel(int id, string observacion)
        {
            var response = new ApiResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("GestFinanc.ComprobanteIngreso_Delete");
                    _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
                    _db.AddDynamicParam("idComprobanteIngreso", id);
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
