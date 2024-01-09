using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Restaurant.Core.Interfaces;
using Services.Common;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionService _promotionService;
        private readonly S3ObjectCustom _s3ObjectCustom;
        private readonly IS3StorageService _storageService;
        private readonly IConfiguration _configuration;
        public PromotionController(IConfiguration configuration, IPromotionService promotionService,
            S3ObjectCustom s3ObjectCustom,
            IS3StorageService storage)
        {
            _configuration = configuration;
            _promotionService = promotionService;
            _s3ObjectCustom = s3ObjectCustom;
            _storageService = storage;

        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", json }
                };
                var response = await _promotionService.GetAsync(parameters);
                if (response == null) { return NoContent(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest("Error on get: " + ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(string json, IFormFile file)
        {
            
            try
            {
                if (file != null)
                {
                    await _s3ObjectCustom.Add($"{User.GetIDCardCompany}/promociones/", file);
                }

                var parameters = new Dictionary<string, object> {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", SqlStringParam.Sanitize(json) },
                    {"s3ObjectUrl", _s3ObjectCustom.S3ObjectUrl ?? "" },
                    {"s3ObjectKey", _s3ObjectCustom.S3ObjectKey ?? "" }
                };

                int userRoleId = User.GetUserRoleId();
                var response = await _promotionService.PostAsync(parameters);
                if (response == null) { return NoContent(); }

                dynamic decode = JsonConvert.DeserializeObject(response);

                if (decode.code == "1" && file != null)
                { 
                    var s3Response = await _storageService.UploadAsync(_s3ObjectCustom);
                    _s3ObjectCustom.Dispose();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                if (file != null)
                {
                    _s3ObjectCustom.Dispose();
                }
                return BadRequest("Error on put: " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, string json, IFormFile file)
        {
            
            try
            {
                if (file != null)
                {
                    await _s3ObjectCustom.Add($"{User.GetIDCardCompany}/promociones/", file);
                }

                var parameters = new Dictionary<string, object> {
                    {"userRoleId", User.GetUserRoleId() },
                    {"id", id },
                    {"json", SqlStringParam.Sanitize(json) },
                    {"s3ObjectUrl", _s3ObjectCustom.S3ObjectUrl ?? "" },
                    {"s3ObjectKey", _s3ObjectCustom.S3ObjectKey ?? "" }
                };

                var response = await _promotionService.PutAsync(parameters);
                if (response == null) { return NoContent(); }

                dynamic decode = JsonConvert.DeserializeObject(response);

                if (decode.code == "1" && file != null)
                {
                    var s3Response = await _storageService.UploadAsync(_s3ObjectCustom);
                    _s3ObjectCustom.Dispose();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                if (file != null)
                {
                    _s3ObjectCustom.Dispose();
                }
                return BadRequest(ex.Message);
            }
        }
    }
}
