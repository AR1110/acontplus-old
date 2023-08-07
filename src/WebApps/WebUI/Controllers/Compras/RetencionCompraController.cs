using DataAccess;
using DataAccess.Compras;
using DataAccess.RetencionIvaRenta;
using Domain.Models;
using Domain.ViewModels;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace WebUI.Controllers.Ingresos
{
    public class RetencionCompraController : Controller
    {
        GenericResponse _gr = new();
        private RetencionCompraDao _rc;
        private GenerateRetencionDao _gra;
        private DataAccessObject _dao;

        private IConfiguration _configuration;


        public RetencionCompraController(IConfiguration config)
        {
            _configuration = config;

            _dao = new DataAccessObject(_configuration);
            _gra = new GenerateRetencionDao(_configuration);
            _rc = new RetencionCompraDao(_configuration);
        }

        //private readonly IWebHostEnvironment _hostingEnviromet; 


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] RetencionCompraViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            _gr = await _rc.InsertAsync(idRol, data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _rc.GetAsync(idRol, json);
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
                await _db.SPExecute("Compra.Retencion_Get_Id");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in GetId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            return Ok(_response);

        }


        public async Task<IActionResult> GetTipoImpuesto(string busqueda)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _gra.GetTipoImpuestoAsync(idRol, busqueda);
            return Ok(res);
        }


        //Actualizar Retencion Fisica 
        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] RetencionCompraViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            //RetencionCompraViewModel data = JsonConvert.DeserializeObject<RetencionCompraViewModel>(jsonData);
            _gr = await _rc.UpdateAsync(idRol, id, data);
            return Ok(_gr);
        }


        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Compra.Retencion_Delete", parameters)));
        }

    }
}
