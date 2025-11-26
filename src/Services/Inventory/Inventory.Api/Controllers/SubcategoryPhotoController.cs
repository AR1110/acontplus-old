using Acontplus.Core.Extensions;

namespace Inventory.Api.Controllers;

public class SubcategoryPhotoController(
    ISubcategoryPhotoRepository subcategoryPhoto,
    IS3StorageService storageService,
    S3ObjectCustom s3ObjectCustom)
    : BaseApiController
{
    private const string IdCardCompany = "idCardCompany";
    private const string BucketDirectory = "/subcategorias/";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await subcategoryPhoto.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return response == null ? BadRequest($"Cant get data: {json}") : Ok(response);
    }

    [HttpPost("{subcategoryId}")]
    public async Task<IActionResult> Post(int subcategoryId, IFormFile file)
    {
        try
        {
            var data = new SubcategoryPhoto
            {
                CreatedByUserId = User.GetUserId(),
                Id = 0
            };
            if (file != null)
                await s3ObjectCustom.Initialize($"{User.GetClaimValue<string>(IdCardCompany)}{BucketDirectory}", file);

            data.SubcategoryId = subcategoryId;
            data.S3ObjectKey = s3ObjectCustom.S3ObjectKey;
            data.S3ObjectUrl = s3ObjectCustom.S3ObjectUrl;
            var response = await subcategoryPhoto.AddAsync(data);
            if (response.Code == "1" && file != null)
            {
                var s3Response = await storageService.UploadAsync(s3ObjectCustom);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            if (file != null)
            {
            }

            return BadRequest(ex.Message);
        }
    }

    [HttpPost("Put/{id}")]
    public async Task<IActionResult> Put(int id, string json, IFormFile file)
    {
        try
        {
            var data = new SubcategoryPhoto
            {
                Id = 0
            };
            data = JsonExtensions.DeserializeOptimized<SubcategoryPhoto>(json);
            data.UpdatedByUserId = User.GetUserId();
            if (file != null)
                await s3ObjectCustom.Initialize($"{User.GetClaimValue<string>(IdCardCompany)}{BucketDirectory}", file,
                    data.S3ObjectKey,
                    data.S3ObjectUrl);

            var response = await subcategoryPhoto.UpdateAsync(id, data);
            if (response.Code == "1" && file != null)
            {
                var s3Response = await storageService.UpdateAsync(s3ObjectCustom);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            if (file != null)
            {
            }

            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await subcategoryPhoto.DeleteAsync(id, User.GetUserId());
        return Ok(response);
    }
}
