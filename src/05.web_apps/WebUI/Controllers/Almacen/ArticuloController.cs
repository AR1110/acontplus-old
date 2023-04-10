using Domain.Models;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Almacen;
using Domain.ViewModels.Almacen;
using Helpers;

namespace WebUI.Controllers
{
    public class ArticuloController : Controller
    {
        // GET: Articulo
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        GenericResponse _gr = new();
        private ArticuloDao _a;
        //private readonly LogWriter _log;
        private readonly DbAccess _db;

        public ArticuloController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            _a = new ArticuloDao(_configuration);
            //_log = new LogWriter(_configuration);
            _db = new DbAccess(_configuration);
        }


        public IActionResult Index()
        {
            ViewData["idRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return View();
        }

        public PartialViewResult MdAutocomplete()
        {
            return PartialView();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Almacen.Articulo_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Almacen.Articulo_Get_Id", parameters)));
        }

        [HttpGet]
        //Get Data Articulo para Ventas 
        public async Task<IActionResult> GetIdBySale(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Almacen.Articulo_Get_Id_By_Sale", parameters)));
        }


        [HttpGet]
        //Get Data Articulo for Purchase=Compras    
        public async Task<IActionResult> GetIdByPurchase(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Almacen.Articulo_Get_Id_By_Purchase", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> Search(string json)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Search");
                _db.AddDynamicParam("idRol", _idRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
              //  _log.LogError("Error while search articles: \n" + ex.ToString());
                _response.Create(code: "0", "Error al buscar articulo");
            }
            finally
            {
                _db.Close();
            }

            return Ok(_response);
        }

        [HttpGet]
        //Listar articulo de manera General: bodegas, tarifas, sucursales
        public async Task<IActionResult> List(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Almacen.Articulo_Get_List_Info", parameters)));
        }

        [HttpGet]
        //Get Data Articulo para Ventas 
        public async Task<IActionResult> GetFormData(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Almacen.Articulo_Get_Data_Form", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ArticuloParams data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("jsonArticulo", data.jsonArticulo);
            parameters.Add("json", data.jsonpvp);
            parameters.Add("idBodega", data.idBodega);
            parameters.Add("ubicacion", data.ubicacion ?? "");
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Articulo_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int idArticulo, [FromBody] ArticuloParams data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", idArticulo);
            parameters.Add("jsonArticulo", data.jsonArticulo);
            parameters.Add("json", data.jsonpvp);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Articulo_Update", parameters)));
        }


        public async Task<IActionResult> Delete(int idArticulo)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", idArticulo);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Articulo_Delete", parameters)));
        }

        //Operaciones Especiales 
        //Buscar Articulo por descripcion o por còdigo
        public async Task<IActionResult> SearchArticuloFilter(string busqueda, bool condicion)
        {
            _gr = await _a.SearchFilterAsync(_idRol, busqueda, condicion);
            return Ok(_gr);
        }




        //Historial de Compras o Ventas del articulo.
        public async Task<IActionResult> HistoryEntradaArticulo(int idArticulo)
        {
            _gr = await _a.HistoryEntradaAsync(_idRol, idArticulo);
            return Ok(_gr);
        }

        public async Task<IActionResult> SearchFilterFracc(string busqueda)
        {
            var res = await _a.SearchFilterFraccAsync(_idRol, busqueda);
            return Ok(res);
        }

    }
}