using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DataAccess.Compras;
using DataAccess.RetencionIvaRenta;
using Helpers;
using DataAccess;

namespace WebUI.Controllers.Ingresos
{
    public class RetencionCompraController : Controller
    {
        GenericResponse _gr = new();
        private RetencionCompraDao _rc;
        private GenerateRetencionDao _gra;
        private DataAccessObject _dao;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private IConfiguration _config;
        private readonly string _urlApi = "";
        private readonly int _idRol;

        public RetencionCompraController(IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _config = config;
            _urlApi = _config.GetSection("UrlApis").GetSection("AcontPlusApi").Value;
            _httpContextAccessor = httpContextAccessor;
            _dao = new DataAccessObject(_config);
            _gra = new GenerateRetencionDao(_config);
            _rc = new RetencionCompraDao(_config);
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
        }

        //private readonly IWebHostEnvironment _hostingEnviromet; 

        [Authorize]
        public IActionResult Index()
        {
            ViewData["idRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] RetencionCompraViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _gr = await _rc.InsertAsync(idRol, data);
            return Ok(_gr);
        }


        public async Task<IActionResult> Get(string json)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _rc.GetAsync(idRol, json);
            return Ok(res);
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Compra.Retencion_Get_Id", parameters)));

        }


        public async Task<IActionResult> GetTipoImpuesto(string busqueda)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _gra.GetTipoImpuestoAsync(idRol, busqueda);
            return Ok(res);
        }


        //Actualizar Retencion Fisica 
        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] RetencionCompraViewModel data)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            //RetencionCompraViewModel data = JsonConvert.DeserializeObject<RetencionCompraViewModel>(jsonData);
            _gr = await _rc.UpdateAsync(idRol, id, data);
            return Ok(_gr);
        }


        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Compra.Retencion_Delete", parameters)));
        }

    }
}
