using Common.Core.Interfaces;
using Common.Core.Models;
using Lib.Common.DbUtils;
using Lib.Common.Dtos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Restaurant.Core.Entities;
using Restaurant.Core.Interfaces;
using Services.Common;

namespace Restaurant.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionService _promotionService;
        private readonly IStorageService _storageService;
        private readonly IConfiguration _configuration;


        public PromotionController(IConfiguration configuration, IPromotionService promotionService, IStorageService storage)
        {
            _configuration = configuration;
            _promotionService = promotionService;
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
            var s3file = new S3FileDto();
            try
            {
                if (file != null)
                {
                    var fileExt = Path.GetExtension(file.FileName);
                    s3file.BucketName = _configuration["S3Bucket:Name"];
                    s3file.Region = _configuration["S3Bucket:Region"];
                    s3file.S3ObjectKey = $"{User.GetIDCardCompany()}/articulos/{Guid.NewGuid()}{fileExt}";
                    s3file.S3ObjectUrl = $"https://{s3file.BucketName}.s3.{s3file.Region}.amazonaws.com/{s3file.S3ObjectKey}";
                }

                var parameters = new Dictionary<string, object> {
                    {"userRoleId", User.GetUserRoleId() },
                    {"json", SqlStringParam.Sanitize(json) },
                    {"s3ObjectUrl", s3file.S3ObjectUrl ?? "" },
                    {"s3ObjectKey", s3file.S3ObjectKey ?? "" }
                };

                int userRoleId = User.GetUserRoleId();
                var response = await _promotionService.PostAsync(parameters);
                if (response == null) { return NoContent(); }

                dynamic decode = JsonConvert.DeserializeObject(response);

                if (decode.code == "1" && file != null)
                {
                    await using var memoryStream = new MemoryStream();

                    await file.CopyToAsync(memoryStream);
                    var s3 = new S3Object()
                    {
                        BucketName = s3file.BucketName,
                        InputStream = memoryStream,
                        Name = s3file.S3ObjectKey
                    };
                    var credentials = new AwsCredentials()
                    {
                        Key = _configuration["AwsConfiguration:AWSAccessKey"],
                        Secret = _configuration["AwsConfiguration:AWSSecretKey"]
                    };
                    var s3Response = await _storageService.UploadFileAsync(s3, credentials);
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest("Error on put: " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, string json, IFormFile file)
        {
            var s3file = new S3FileDto();
            try
            {
                if (file != null)
                {
                    var fileExt = Path.GetExtension(file.FileName);
                    s3file.BucketName = _configuration["S3Bucket:Name"];
                    s3file.Region = _configuration["S3Bucket:Region"];
                    s3file.S3ObjectKey = $"{User.GetIDCardCompany()}/articulos/{Guid.NewGuid()}{fileExt}";
                    s3file.S3ObjectUrl = $"https://{s3file.BucketName}.s3.{s3file.Region}.amazonaws.com/{s3file.S3ObjectKey}";
                }

                var parameters = new Dictionary<string, object> {
                    {"userRoleId", User.GetUserRoleId() },
                    {"id", id },
                    {"json", SqlStringParam.Sanitize(json) },
                    {"s3ObjectUrl", s3file.S3ObjectUrl ?? "" },
                    {"s3ObjectKey", s3file.S3ObjectKey ?? "" }
                };

                var response = await _promotionService.PutAsync(parameters);
                if (response == null) { return NoContent(); }

                dynamic decode = JsonConvert.DeserializeObject(response);

                if (decode.code == "1" && file != null)
                {
                    await using var memoryStream = new MemoryStream();

                    await file.CopyToAsync(memoryStream);
                    var s3 = new S3Object()
                    {
                        BucketName = s3file.BucketName,
                        InputStream = memoryStream,
                        Name = s3file.S3ObjectKey
                    };
                    var credentials = new AwsCredentials()
                    {
                        Key = _configuration["AwsConfiguration:AWSAccessKey"],
                        Secret = _configuration["AwsConfiguration:AWSSecretKey"]
                    };
                    var s3Response = await _storageService.UploadFileAsync(s3, credentials);
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
