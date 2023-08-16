using DataAccess;
using DataAccess.Ventas;
using Domain.ViewModels.Ventas;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace WebUI.Controllers.Ventas
{
    public class NotaCreditoClienteController : Controller
    {
        private NotaCreditoDao _nc;
        private GenericResponse _gr = new();
        private IConfiguration _configuration;
        private readonly LogWriter _log;

        public NotaCreditoClienteController(IConfiguration config, LogWriter log)
        {
            _configuration = config;
            _log = log;

            _nc = new NotaCreditoDao(_configuration);
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] NotaCreditoViewModel data)
        {
            _gr = await _nc.InsertAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), data);
            return Ok(_gr);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var res = await _nc.GetAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), json);
            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.NotaCredito_Get_Id");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in GetId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);

        }

        [HttpPut]
        public async Task<IActionResult> Update(long id, [FromBody] NotaCreditoViewModel data)
        {
            _gr = await _nc.UpdateAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), id, data);
            return Ok(_gr);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id) => Ok(await _nc.DeleteAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), id));
    }
}
