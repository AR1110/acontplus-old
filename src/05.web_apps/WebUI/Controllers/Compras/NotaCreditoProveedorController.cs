using DataAccess.Compras;
using Domain.ViewModels.Compras;
using Microsoft.AspNetCore.Mvc;
using DataAccess;
using Helpers;
using Common.Logs;

namespace WebUI.Controllers.Compras
{
    public class NotaCreditoProveedorController : Controller
    {
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0

        private NotaCreditoProveedorDao _ncprov;
        public NotaCreditoProveedorController(IConfiguration configuration)
        {
            _configuration = configuration;
            _ncprov = new NotaCreditoProveedorDao(_configuration);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] NotaCreditoProveedorViewModel data)
        {
            if (data == null)
            {
                return NotFound();
            }
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ncprov.InsertAsync(idRol, data);
            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ncprov.GetAsync(idRol, json);
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
                await _db.SPExecute("Compra.NotaCredito_Get_Id");
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

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] NotaCreditoProveedorViewModel data)
        {
            if (data == null)
            {
                return NotFound();
            }
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ncprov.UpdateAsync(idRol, id, data);
            return Ok(res);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ncprov.DeleteAsync(idRol, id);
            return Ok(res);
        }
    }
}
