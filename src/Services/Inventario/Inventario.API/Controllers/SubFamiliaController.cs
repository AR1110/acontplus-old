using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Models.Almacen;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    public class SubFamiliaController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly S3ObjectCustom _s3ObjectCustom;
        private readonly IS3StorageService _storageService;
        private readonly LogWriter _log;
        public SubFamiliaController(IConfiguration configuration,
            S3ObjectCustom s3ObjectCustom,
            IS3StorageService storageService, LogWriter log)
        {
            _configuration = configuration;
            _s3ObjectCustom = s3ObjectCustom;
            _storageService = storageService;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Inventario.Subfamilia_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar SubFamilias: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar SubFamilias");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Post")]
        public async Task<IActionResult> Post(string json, IFormFile file)
        { 
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            
            try
            {
                if (file != null)
                { 
                    await _s3ObjectCustom.Add($"{User.GetIDCardCompany()}/subfamilias/", file);
                }
                int userRoleId = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Inventario.Subfamilia_Insert");
                _db.AddDynamicParam("userRoleId", userRoleId);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _db.AddDynamicParam("s3ObjectKey", _s3ObjectCustom.S3ObjectKey ?? "");
                _db.AddDynamicParam("s3ObjectUrl", _s3ObjectCustom.S3ObjectUrl ?? "");

                _response = _db.GetDefault();
                if (_response.code == "1" && file != null)
                { 
                    var s3Response = await _storageService.UploadAsync(_s3ObjectCustom);
                }
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al insertar subfamilia: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar subfamilia");
            }
            finally
            {
                if (file != null)
                {
                    _s3ObjectCustom.Dispose();
                }
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Put/{id}")]
        public async Task<IActionResult> Put(int id, string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            var data = JsonConvert.DeserializeObject<SubFamilia>(json); 
            try
            {
                int userRoleId = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Inventario.Subfamilia_Update");
                _db.AddDynamicParam("userRoleId", userRoleId);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault(); 
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar subfamilia: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar subfamilia");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.SubFamilia_Update_Cancel");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al eliminar subfamilia: \n" + ex.ToString());
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
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar SubFamilias para Select: \n" + ex.ToString());
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
