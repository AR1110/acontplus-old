using DataAccess;
using DataAccess.Ventas;
using Domain.ViewModels.Ventas;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace WebUI.Controllers.Ventas
{
    public class RetencionVentaController : Controller
    {
        private readonly IConfiguration _configuration;

        private RetencionVentaDao _rv;
        public RetencionVentaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _rv = new RetencionVentaDao(_configuration);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RetencionVentaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _rv.InsertAsync(idRol, data);
            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _rv.GetAsync(idRol, json);
            return Ok(res);
        }

        [HttpPut]
        public async Task<IActionResult> Put(int idRetencionVenta, [FromBody] RetencionVentaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _rv.UpdateAsync(idRol, idRetencionVenta, data);
            return Ok(res);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _rv.DeleteAsync(idRol, id);
            return Ok(res);

        }


        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.Retencion_Get_Id");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in GetId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
