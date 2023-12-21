using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Inventario.Core.Entities;
using Inventario.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    public class ProductPhotoController : BaseApiController
    {
        private readonly IProductPhotoService _productPhoto;
        private readonly IS3StorageService _storageService;
        private readonly S3ObjectCustom _s3ObjectCustom;
        private readonly LogWriter _log;
        public ProductPhotoController(IProductPhotoService productPhoto,
            IS3StorageService storageService,
            S3ObjectCustom s3ObjectCustom,
            LogWriter log)
        {
            _productPhoto = productPhoto;
            _storageService = storageService;
            _s3ObjectCustom = s3ObjectCustom;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _productPhoto.GetAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null) { return BadRequest($"Cant get data: {json}"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Get: {json} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("{productId}")]
        public async Task<IActionResult> Post(int productId, IFormFile file)
        {
            try
            {
                var data = new ProductPhoto();
                data.UserId = User.GetUserId();
                if (file != null)
                {
                    await _s3ObjectCustom.Add($"{User.GetIDCardCompany()}/articulos/", file);
                }
                var response = await _productPhoto.AddAsync(data);
                if (response.code == "1" && file != null)
                {
                    var s3Response = await _storageService.UploadAsync(_s3ObjectCustom);
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Post: {productId} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, string json, IFormFile file)
        {
            try
            {
                var data = new ProductPhoto();
                data = JsonConvert.DeserializeObject<ProductPhoto>(json);
                data.UserId = User.GetUserId();
                if (file != null)
                {
                    await _s3ObjectCustom.Add($"{User.GetIDCardCompany()}/articulos/", file, data.S3ObjectKey, data.S3ObjectUrl);
                }
                var response = await _productPhoto.UpdateAsync(id, data);
                if (response.code == "1" && file != null)
                {
                    var s3Response = await _storageService.UpdateAsync(_s3ObjectCustom);
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Put: {json} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _productPhoto.DeleteAsync(id, User.GetUserId());
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Delete: {id} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
    }
}
