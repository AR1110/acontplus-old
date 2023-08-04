using DataAccess;
using Domain.Models.Almacen;
using Helpers;
using Inventario.Application.Services;
using Inventario.Core.Interfaces;
using Inventario.Core.Models;
using Lib.Common;
using Lib.Common.Api;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using System.Text.Json;

namespace Inventario.API.Controllers.v3
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("3.0")]
    public class SubFamiliaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IStorageService _storageService;

        private string urlBase = "https://acontplus.s3.us-east-2.amazonaws.com/";

        public SubFamiliaController(IConfiguration configuration, IStorageService storageService)
        {
            _configuration = configuration;
            _storageService = storageService;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Restaurant.Category_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al listar SubFamilias: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar SubFamilias");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Post")]
        public async Task<IActionResult> Post([FromBody] ApiRequest request)
        {
            GenericResponse _response = new GenericResponse();

            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Restaurant.Category_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", Converters.SerializeDictionary(request.Data));
                _response = _db.GetDefault();

            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al insertar subfamilia: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar subfamilia");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ApiRequest request)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Restaurant.Category_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", Converters.SerializeDictionary(request.Data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al actualizar subfamilia: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar subfamilia");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Restaurant.Category_Update_Cancel");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al eliminar catgegoria: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar subfamilia");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("ListForSelect")]
        public async Task<IActionResult> ListForSelect(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.SubFamilia_For_Select");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error al listar SubFamilias para Select: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar SubFamilias para Select");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
