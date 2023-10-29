using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Services.Common;

namespace WebUI.Controllers.Financiero
{
    public class ComprobanteIngresoController : Controller
    {
        private readonly IConfiguration _configuration;

        private DataAccessObject _dao;

        public ComprobanteIngresoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
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
            var _response = new GenericResponse();
            var parameters = new Dictionary<string, object>();
            parameters.Add("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("idComprobanteIngreso", id);
            parameters.Add("observacion", observacion);
            _response = DbResponse.SPDefault(await _dao.GetDataTableAsync("GestFinanc.ComprobanteIngreso_Delete", parameters));
            return Ok(_response);
        }


    }
}
