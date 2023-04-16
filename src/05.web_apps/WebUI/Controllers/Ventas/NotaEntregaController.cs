using DataAccess.Ventas;
using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Helpers;
using DataAccess;
using Newtonsoft.Json;
using Common.Logs;

namespace WebUI.Controllers.Ventas
{
    public class NotaEntregaController : Controller
    {
        private IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        GenericResponse _gr = new();
        private NotaEntregaDao _ne;

        public NotaEntregaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _ne = new NotaEntregaDao(_configuration);


        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Ventas.NotaEntrega_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Ventas.NotaEntrega_GetId");
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

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] NotaEntregaViewModel data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("jsonNotaEntrega", JsonConvert.SerializeObject(data.notaEntrega));
            parameters.Add("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
            parameters.Add("jsonManejoArticulo", JsonConvert.SerializeObject(data.manejoArticulo));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.NotaEntrega_Insert", parameters)));

        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] NotaEntregaViewModel data)
        {

            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("jsonNotaEntrega", JsonConvert.SerializeObject(data.notaEntrega));
            parameters.Add("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
            parameters.Add("jsonManejoArticulo", JsonConvert.SerializeObject(data.manejoArticulo));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.NotaEntrega_Update", parameters)));

        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.NotaEntrega_Delete", parameters)));

        }
    }
}
