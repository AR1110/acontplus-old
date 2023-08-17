using DataAccess;
using Domain.Models;
using Lib.Common;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace WebUI.Controllers.Sri
{
    public class PtoEmisionController : Controller
    {
        // GET: Establecimiento
        private readonly IConfiguration _configuration;
        private TipoAmbienteDao _tipA;
        private readonly LogWriter _log;
        public PtoEmisionController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
            _tipA = new TipoAmbienteDao(_configuration);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] PtoEmision data)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Sri.PtoEmision_Insert");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("codEstab", data.codEstab);
                _db.AddDynamicParam("ambiente", data.ambiente);
                _db.AddDynamicParam("ptoEmi", data.ptoEmi);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Insert: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] PtoEmision data)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Sri.PtoEmision_Update");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("ambiente", data.ambiente);
                _db.AddDynamicParam("ptoEmi", data.ptoEmi);
                _db.AddDynamicParam("estado", data.estado);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Update: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Sri.PtoEmision_Delete");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Delete: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Eliminar");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        //Get Tipo Ambiente 
        public IActionResult GetTipoAmbiente()
        {
            var res = _tipA.listTipoAmbiente();
            return Ok(res);
        }
    }
}
