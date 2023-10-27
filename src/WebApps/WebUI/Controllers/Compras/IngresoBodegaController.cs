using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using DataAccess.Compras;
using Domain.Models;
using Domain.ViewModels.Compras;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace WebUI.Controllers.Compras
{
    public class IngresoBodegaController : Controller
    {
        private GenericResponse _gr = new();
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        private IngresoBodegaDao _ib;
        private readonly LogWriter _log;
        public IngresoBodegaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _ib = new IngresoBodegaDao(_configuration);
            _log = log;
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
            parameters.Add("json", SqlStringParam.Sanitize(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Compra.IngresoBodega_Get", parameters)));
        }
        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            DbAccess _db = new DbAccess(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Compra.IngresoBodega_Get_Id");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in articulo getId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos del articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] IngresoBodegaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ib.InsertAsync(idRol, data);
            return Ok(res);
        }
        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] IngresoBodegaViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _ib.UpdateAsync(idRol, id, data);
            return Ok(res);
        }
    }
}
