using Domain.Models;
using Domain.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DataAccess;
using Helpers;

namespace WebUI.Controllers.Ventas
{


    public class FacturaVentaController : Controller
    {
        private readonly IConfiguration _configuration;
         ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;
        
        GenericResponse _gr = new();

  
        public FacturaVentaController(IConfiguration configuration)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            
            

        }

        
        public IActionResult Index(int id)
        {
            return View();
        }

        public IActionResult _ModalAddUpdateFacturaVenta()
        {
            return PartialView();
        }


        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Ventas.Factura_Get", parameters)));
        }

        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Ventas.Factura_Get_Id", parameters)));

        }

        [HttpGet]
        public async Task<IActionResult> GetDataForm(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataSet(await _dao.GetDataSetAsync("Ventas.Factura_Get_Data_Form", parameters)));
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] FacturaParams data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("jsonFactura", data.factura);
            parameters.Add("jsonDetalle", data.detalle);
            parameters.Add("jsonInfoAdicional", data.adicional);
            parameters.Add("jsonManejoArticulo", data.manejoArticulo ?? "");
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.Factura_Insert", parameters)));
        }


        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] FacturaParams data)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            parameters.Add("jsonFactura", data.factura);
            parameters.Add("jsonDetalle", data.detalle);
            parameters.Add("jsonInfoAdicional", data.adicional);
            parameters.Add("jsonManejoArticulo", data.manejoArticulo ?? "");
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.Factura_Update", parameters)));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Ventas.Factura_Delete", parameters)));
        }

    }
}
