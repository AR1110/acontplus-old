using Common.Core.Models;
using Common.Core.ViewModels;
using DataAccess;
using DataAccess.Compras;
using DataAccess.RetencionIvaRenta;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace WebUI.Controllers.Compras
{
    public class RetencionCompraController : Controller
    {
        GenericResponse _gr = new();
        private RetencionCompraDao _rc;
        private GenerateRetencionDao _gra;


        private IConfiguration _configuration;

        private readonly LogWriter _log;
        public RetencionCompraController(IConfiguration config, LogWriter log)
        {
            _configuration = config;


            _gra = new GenerateRetencionDao(_configuration);
            _rc = new RetencionCompraDao(_configuration);
            _log = log;
        }

        //private readonly IWebHostEnvironment _hostingEnviromet; 


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] RetencionCompraViewModel data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _rc.InsertAsync(idRol, data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Get(string json)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _rc.GetAsync(idRol, json);
            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            var _db = new DbAccess(_configuration);

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Compra.Retencion_Get_Id");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in GetId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            return Ok(_response);

        }


        public async Task<IActionResult> GetTipoImpuesto(string busqueda)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _gra.GetTipoImpuestoAsync(idRol, busqueda);
            return Ok(res);
        }


        //Actualizar Retencion Fisica 
        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] RetencionCompraViewModel data)
        {
            var idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            //RetencionCompraViewModel data = JsonConvert.DeserializeObject<RetencionCompraViewModel>(jsonData);
            _gr = await _rc.UpdateAsync(idRol, id, data);
            return Ok(_gr);
        }


        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Compra.Retencion_Delete");
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
