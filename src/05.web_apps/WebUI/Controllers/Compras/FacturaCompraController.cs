using DataAccess.Compras;
using Domain.Models;
using Domain.ViewModels.Compras;
using Microsoft.AspNetCore.Mvc;
using DataAccess.Almacen;
using DataAccess;
using Helpers;
using Newtonsoft.Json;
using Common.Logs;

namespace WebUI.Controllers.Compras
{
    public class FacturaCompraController : Controller
    {
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private ArticuloDao _a;
        private FacturaCompraDao _fc;

        public FacturaCompraController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);


            _a = new ArticuloDao(_configuration);
            _fc = new FacturaCompraDao(_configuration);
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
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Compra.Factura_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Compra.Factura_Get_Id");
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

        [HttpGet]
        public async Task<IActionResult> GetDataForm(string json)
        {
            DbAccess _db = new DbAccess(_configuration);
            LogWriter _log = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Compra.Factura_Get_Data_Form");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogError("Error in GetDataForm: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] FacturaCompraViewModel data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("jsonFactura", JsonConvert.SerializeObject(data.factura));
            parameters.Add("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
            parameters.Add("jsonManejoArticuloDetalle", JsonConvert.SerializeObject(data.manejoArticuloDetalle));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Compra.Factura_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] FacturaCompraViewModel data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("jsonFactura", JsonConvert.SerializeObject(data.factura));
            parameters.Add("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
            parameters.Add("jsonManejoArticuloDetalle", JsonConvert.SerializeObject(data.manejoArticuloDetalle));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Compra.Factura_Update", parameters)));
        }



        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Compra.Factura_Delete", parameters)));
        }


        //Get Factura By Proveedor for module Retention Purchase
        public async Task<IActionResult> GetByProveedor(int idProveedor)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _fc.GetForProveedorAsync(idRol, idProveedor);
            return Ok(res);
        }

        public async Task<IActionResult> GetDetailByInvoice(int idFactura, int idSubContribuyente, int idConfigContribuyente)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
            var res = await _fc.GetDetailAsync(idRol, idFactura, idSubContribuyente, idConfigContribuyente);
            return Ok(res);
        }

    }
}
