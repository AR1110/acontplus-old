using WebUI.ApiClient;
using DataAccess.Compras;
using WebUI.Utils;
using Domain.Models;
using Domain.ViewModels.Compras;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using DataAccess.Almacen;
using DataAccess;
using Helpers;
using Newtonsoft.Json;
using DataAccess.Inventario;

namespace WebUI.Controllers.Compras
{
    public class FacturaCompraController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor; ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        private readonly int _idRol;
        GenericResponse _gr = new();
        readonly ArticuloDao _a = new();
        FacturaCompraDao _fc = new();        

        public FacturaCompraController(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _httpContextAccessor = httpContextAccessor;
            _idRol = Convert.ToInt32(_httpContextAccessor.HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);

        }

        [Authorize]
        public IActionResult Index()
        {
            ViewData["idRol"] = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Compra.Factura_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Compra.Factura_Get_Id", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetDataForm(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Compra.Factura_Get_Data_Form", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] FacturaCompraViewModel data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
            parameters.Add("jsonFactura", JsonConvert.SerializeObject(data.factura));
            parameters.Add("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
            parameters.Add("jsonManejoArticuloDetalle", JsonConvert.SerializeObject(data.manejoArticuloDetalle));
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Compra.Factura_Insert", parameters)));
        }

        [HttpPut]
        public async Task<IActionResult> Put(int id, [FromBody] FacturaCompraViewModel data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", _idRol);
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
            parameters.Add("idRol", _idRol);
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Compra.Factura_Delete", parameters)));
        }


        //Get Factura By Proveedor for module Retention Purchase
        public async Task<IActionResult> GetByProveedor(int idProveedor)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _fc.GetForProveedorAsync(idRol, idProveedor);
            return Ok(res);
        }

        public async Task<IActionResult> GetDetailByInvoice(int idFactura, int idSubContribuyente, int idConfigContribuyente)
        {
            int idRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idRol").Value);
            var res = await _fc.GetDetailAsync(idRol, idFactura, idSubContribuyente, idConfigContribuyente);
            return Ok(res);
        }

    }
}
