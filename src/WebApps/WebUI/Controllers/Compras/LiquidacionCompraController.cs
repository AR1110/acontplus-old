using DataAccess;
using DataAccess.Compras;
using Domain.Models;
using Domain.ViewModels.Compras;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Logs;

namespace WebUI.Controllers.Compras
{
    public class LiquidacionCompraController : Controller
    {
        private GenericResponse _gr = new();
        private LiquidacionCompraDao _lc;
        private readonly IConfiguration _configuration;
        ///Visit https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-context?view=aspnetcore-6.0
        private DataAccessObject _dao;

        private readonly LogWriter _log;

        public LiquidacionCompraController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _dao = new DataAccessObject(_configuration);
            _lc = new LiquidacionCompraDao(_configuration);
            _log = log;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] LiquidacionCompraViewModel data)
        {
            DbAccess _db = new DbAccess(_configuration);
            
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Liquidacion_Insert");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("jsonLiquidacion", SqlValidation.ValidateSqlString(JsonConvert.SerializeObject(data.liquidacion)));
                _db.AddDynamicParam("jsonDetalle", SqlValidation.ValidateSqlString(JsonConvert.SerializeObject(data.detalle)));
                _db.AddDynamicParam("jsonInfoAdicional", SqlValidation.ValidateSqlString(JsonConvert.SerializeObject(data.adicional)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear la liquidacion de compra: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al crear la liquidacion compra");
            }
            return Ok(_response);
        }



        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("json", SqlValidation.ValidateSqlString(json));
            return Ok(DbResponse.SPDataTable(await _dao.GetDataTableAsync("Compra.Liquidacion_Get", parameters)));
        }


        [HttpGet]
        public async Task<IActionResult> GetId(int id)
        {
            DbAccess _db = new DbAccess(_configuration);
            
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Compra.Liquidacion_Get_Id");
                _db.AddDynamicParam("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in GetId: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al Obtener los datos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        public async Task<IActionResult> Update(int id, [FromBody] LiquidacionCompraViewModel data)
        {
            DbAccess _db = new DbAccess(_configuration);
            
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Liquidacion_Update");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("idLiquidacionCompra", id);
                _db.AddDynamicParam("jsonLiquidacion", SqlValidation.ValidateSqlString(JsonConvert.SerializeObject(data.liquidacion)));
                _db.AddDynamicParam("jsonDetalle", SqlValidation.ValidateSqlString(JsonConvert.SerializeObject(data.detalle)));
                _db.AddDynamicParam("jsonInfoAdicional", SqlValidation.ValidateSqlString(JsonConvert.SerializeObject(data.adicional)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar la liquidacion de compra: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar la liquidacion compra");
            }
            return Ok(_response);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            Dictionary<string, object> parameters = new Dictionary<string, object>();
            parameters.Add("idRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            parameters.Add("id", id);
            return Ok(DbResponse.SPDefault(await _dao.GetDataTableAsync("Compra.Liquidacion_Delete", parameters)));
        }

    }
}
