using Inventario.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Inventario.Core.Models;
using Helpers;

namespace Inventario.API.Controllers.v3
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("3.0")]
    public class UploadFileController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IStorageService _storageService;
        public UploadFileController(IConfiguration configuration, IStorageService storageService)
        {
            _configuration = configuration;
            _storageService = storageService;
        }


        [HttpPost("upload/{folderName}")]

        [DisableRequestSizeLimit]

        public async Task<IActionResult> Upload(string folderName)
        {
            GenericResponse response = new GenericResponse();
            String urlBase = "https://acontplus.s3.us-east-2.amazonaws.com/";

            //if (!Request.Form.Files.Any()) 

            //    return BadRequest("No files found in the request"); 



            //if (Request.Form.Files.Count > 1) 

            //    return BadRequest("Cannot upload more than one file at a time"); 



            //if (Request.Form.Files[0].Length <= 0) 

            //    return BadRequest("Invalid file length, seems to be empty"); 

            //IFormFile file = Request.Form.Files[0]; 

            var formCollection = await Request.ReadFormAsync();

            var file = formCollection.Files.First();

            await using var memoryStream = new MemoryStream();

            await file.CopyToAsync(memoryStream);

            var fileExt = Path.GetExtension(file.FileName);
            var directory = folderName + "/"; // "category/"
            var docName = $"{Guid.NewGuid()}{fileExt}";
            var fileName = directory + docName;
            var s3 = new S3Object()
            {
                BucketName = "acontplus",
                InputStream = memoryStream,
                Name = fileName
            };
            var credentials = new AwsCredentials()
            {
                Key = _configuration["AwsConfiguration:AWSAccessKey"],
                Secret = _configuration["AwsConfiguration:AWSSecretKey"]
            };
            var result = await _storageService.UploadFileAsync(s3, credentials);

            if (result.StatusCode >= 200 && result.StatusCode < 300)
            {
                response.Create(code: "1", message: result.Message, payload: urlBase + fileName);
            }
            return Ok(response);
        }
    }
}
