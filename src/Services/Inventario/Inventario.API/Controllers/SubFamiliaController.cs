using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Inventario.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Extensions;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    public class SubFamiliaController : BaseApiController
    {
        private readonly ISubFamiliaService _service;
        private readonly S3ObjectCustom _s3ObjectCustom;
        private readonly IS3StorageService _storageService;
        private readonly ICustomLogger _log;

        public SubFamiliaController(S3ObjectCustom s3ObjectCustom, IS3StorageService storageService, ISubFamiliaService service, ICustomLogger log)
        {
            _s3ObjectCustom = s3ObjectCustom;
            _storageService = storageService;
            _service = service;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    { "idUsuarioRol", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(json) }
                };
                var response = await _service.GetAsync(parameters);
                return Ok(response);

            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en get " + ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Post")]
        public async Task<IActionResult> Post(string json, IFormFile file)
        {
            try
            {
                if (file != null)
                {
                    await _s3ObjectCustom.Add($"{User.GetIDCardCompany()}/subfamilias/", file);
                }

                var parameters = new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(json) },
                    { "s3ObjectKey", _s3ObjectCustom.S3ObjectKey ?? "" },
                    { "s3ObjectUrl", _s3ObjectCustom.S3ObjectUrl ?? "" },
                };

                var response = await _service.AddAsync(parameters);

                if (response.code == "1" && file != null)
                {
                    await _storageService.UploadAsync(_s3ObjectCustom);
                }

                if (file != null)
                {
                    _s3ObjectCustom.Dispose();
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en post " + ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("Put/{id}")]
        public async Task<IActionResult> Put(int id, string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() },
                    { "id", id },
                    { "json", SqlStringParam.Sanitize(json) },
                };

                var response = await _service.UpdateAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en put " + ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    { "idUsuarioRol", User.GetUserRoleId() },
                    { "id", id }
                };

                var response = await _service.DeleteAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en put " + ex.Message);
                return BadRequest(ex.Message);
            }
        }
    }
}
