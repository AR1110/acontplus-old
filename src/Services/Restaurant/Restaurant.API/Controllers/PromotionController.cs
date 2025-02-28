using Common.S3Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Services;

namespace Restaurant.API.Controllers;

public class PromotionController(
    IPromotionService promotionService,
    S3ObjectCustom s3ObjectCustom,
    IS3StorageService storage)
    : BaseApiController
{
    private const string IdCardCompany = "idCardCompany";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters =
            new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", json } };
        return Ok(await promotionService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post(string json, IFormFile file)
    {
        try
        {
            if (file != null)
            {
                await s3ObjectCustom.Add($"{User.GetClaimValue<string>(IdCardCompany)}/promociones/", file);
            }

            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) },
                { "s3ObjectUrl", s3ObjectCustom.S3ObjectUrl ?? "" },
                { "s3ObjectKey", s3ObjectCustom.S3ObjectKey ?? "" }
            };

            int userRoleId = User.GetClaimValue<int>("userRoleId");
            var response = await promotionService.AddAsync(parameters);

            if (response.Code == "1" && file != null)
            {
                var s3Response = await storage.UploadAsync(s3ObjectCustom);
                s3ObjectCustom.Dispose();
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            if (file != null)
            {
                s3ObjectCustom.Dispose();
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
                await s3ObjectCustom.Add($"{User.GetClaimValue<string>(IdCardCompany)}/promociones/", file);
            }

            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") },
                { "id", id },
                { "json", SqlStringParam.Sanitize(json) },
                { "s3ObjectUrl", s3ObjectCustom.S3ObjectUrl ?? "" },
                { "s3ObjectKey", s3ObjectCustom.S3ObjectKey ?? "" }
            };

            var response = await promotionService.UpdateAsync(parameters);
            if (response == null) { return NoContent(); }

            if (response.Code == "1" && file != null)
            {
                var s3Response = await storage.UploadAsync(s3ObjectCustom);
                s3ObjectCustom.Dispose();
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            if (file != null)
            {
                s3ObjectCustom.Dispose();
            }

            return BadRequest(ex.Message);
        }
    }
}
