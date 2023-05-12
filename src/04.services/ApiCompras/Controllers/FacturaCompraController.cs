using Common.Logs;
using DataAccess;
using Domain.Dtos.Compras;
using Domain.ViewModels.Compras;
using Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ApiCompras.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturaCompraController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public FacturaCompraController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Factura_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener datos de Factura Compras: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de Facturas Compras");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("GetId")]
        public async Task<IActionResult> GetId(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Factura_Get_Id");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener datos de Factura Compras por Id: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de Facturas Compras por Id");
            }
            finally
            {
                _db.Close();
            } 
            return Ok(_response);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] FacturaCompraViewModel data)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Factura_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("jsonFactura", JsonConvert.SerializeObject(data.factura));
                _db.AddDynamicParam("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
                _db.AddDynamicParam("datosAdiciones", data.datosAdiciones);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al guardar datos de la Factura Compra: " + ex.ToString());
                _response.Create(code: "0", message: "Error al guardar los datos de la Factura Compra");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] FacturaCompraViewModel data)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Factura_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("jsonFactura", JsonConvert.SerializeObject(data.factura));
                _db.AddDynamicParam("jsonDetalle", JsonConvert.SerializeObject(data.detalle));
                _db.AddDynamicParam("datosAdiciones", data.datosAdiciones);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al editar datos de Factura Compra: " + ex.ToString());
                _response.Create(code: "0", message: "Error al editar los datos de la Factura Compra");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Factura_Delete");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al anular la factura compra: " + ex.ToString());
                _response.Create(code: "0", message: "Error al anular la factura");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        //----------------------Other Methods------------------------
        [HttpGet("FindByProveedor/{idProveedor}")]
        public async Task<IActionResult> FindByProveedor(int idProveedor)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Compra.Factura_FindByProveedor");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("idProveedor", idProveedor);
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener facturas por proveedor: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener facturas por proveedor");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
