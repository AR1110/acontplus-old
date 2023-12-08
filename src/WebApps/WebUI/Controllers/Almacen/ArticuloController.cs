using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace WebUI.Controllers.Almacen
{
    public class ArticuloController : Controller
    {
        // GET: Articulo
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0


        GenericResponse _gr = new();
        // private ArticuloDao _a;
        //
        private readonly DbAccess _db;

        public ArticuloController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;



            // _a = new ArticuloDao(_configuration);
            //
            _db = new DbAccess(_configuration);
            _log = log;
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
            var parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlStringParam.Sanitize(json));
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Almacen.Articulo_Get");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    response = _db.GetDataTableAsync();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            var _db = new DbAccess(_configuration);

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Id");
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

        [HttpGet]
        //Get Data Articulo para Ventas 
        public async Task<IActionResult> GetIdBySale(string json)
        {
            var _db = new DbAccess(_configuration);

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Id_By_Sale");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in articulo GetIdBySale: \n" + ex.ToString());
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
            var _db = new DbAccess(_configuration);

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Id_By_Purchase");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in articulo GetIdByPurchase: \n" + ex.ToString());
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

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Search");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while search articles: \n" + ex.ToString());
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
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Almacen.Articulo_Get_List_Info");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    response = _db.GetDataTableAsync();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        //Get Data Articulo para Ventas
        public async Task<IActionResult> GetFormData(string json)
        {
            var _db = new DbAccess(_configuration);

            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Almacen.Articulo_Get_Data_Form");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in articulo GetFormData: \n" + ex.ToString());
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
            var response = new GenericResponse();
            try
            {
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    await _db.SPExecute("Almacen.Articulo_Delete");
                    _db.AddDynamicParam("idRol", User.GetUserRoleId());
                    _db.AddDynamicParam("id", idArticulo);
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
