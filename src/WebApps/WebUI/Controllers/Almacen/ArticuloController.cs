using DataAccess;
using DataAccess.Almacen;
using Domain.Models;
using Domain.ViewModels.Almacen;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace WebUI.Controllers
{
    public class ArticuloController : Controller
    {
        // GET: Articulo
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        GenericResponse _gr = new();
        private ArticuloDao _a;
        //private readonly LogWriter _log;
        private readonly DbAccess _db;

        public ArticuloController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);


            _a = new ArticuloDao(_configuration);
            //_log = new LogWriter(_configuration);
            _db = new DbAccess(_configuration);
        }


        public IActionResult Index()
        {
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
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Almacen.Articulo_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Id");
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in articulo getId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos del articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet]
        //Get Data Articulo para Ventas 
        public async Task<IActionResult> GetIdBySale(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Id_By_Sale");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in articulo GetIdBySale: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos del articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpGet]
        //Get Data Articulo for Purchase=Compras    
        public async Task<IActionResult> GetIdByPurchase(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Id_By_Purchase");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in articulo GetIdByPurchase: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos del articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet]
        public async Task<IActionResult> Search(string json)
        {
            LogWriter _log = new LogWriter(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Search");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error while search articles: \n" + ex.ToString());
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
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Almacen.Articulo_Get_List_Info", parameters)));
        }

        [HttpGet]
        //Get Data Articulo para Ventas
        public async Task<IActionResult> GetFormData(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Data_Form");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in articulo GetFormData: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos del articulo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        public async Task<IActionResult> Delete(int idArticulo)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", idArticulo);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Almacen.Articulo_Delete", parameters)));
        }

        //Operaciones Especiales 
        //Buscar Articulo por descripcion o por còdigo
        public async Task<IActionResult> SearchArticuloFilter(string busqueda, bool condicion)
        {
            _gr = await _a.SearchFilterAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), busqueda, condicion);
            return Ok(_gr);
        }




        //Historial de Compras o Ventas del articulo.
        public async Task<IActionResult> HistoryEntradaArticulo(int idArticulo)
        {
            _gr = await _a.HistoryEntradaAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), idArticulo);
            return Ok(_gr);
        }

        public async Task<IActionResult> SearchFilterFracc(string busqueda)
        {
            var res = await _a.SearchFilterFraccAsync(Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value), busqueda);
            return Ok(res);
        }

    }
}