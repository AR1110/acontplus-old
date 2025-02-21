namespace Inventario.API.Controllers;

public class SubcategoryPhotoController(
    ISubcategoryPhotoService subcategoryPhoto,
    IS3StorageService storageService,
    S3ObjectCustom s3ObjectCustom)
    : BaseApiController
{
    private const string IdCardCompany = "idCardCompany";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {

        var response = await subcategoryPhoto.GetAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
            });
        if (response == null) { return BadRequest($"Cant get data: {json}"); }

        return Ok(response);
    }

    [HttpPost("{subcategoryId}")]
    public async Task<IActionResult> Post(int subcategoryId, IFormFile file)
    {
        try
        {
            var data = new SubcategoryPhoto();
            data.UserId = User.GetUserId();
            if (file != null)
            {
                await s3ObjectCustom.Add($"{User.GetClaimValue<string>(IdCardCompany)}/articulos/", file);
            }

            data.SubcategoryId = subcategoryId;
            data.S3ObjectKey = s3ObjectCustom.S3ObjectKey;
            data.S3ObjectUrl = s3ObjectCustom.S3ObjectUrl;
            var response = await subcategoryPhoto.AddAsync(data);
            if (response.Code == "1" && file != null)
            {
                var s3Response = await storageService.UploadAsync(s3ObjectCustom);
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

    [HttpPost("Put/{id}")]
    public async Task<IActionResult> Put(int id, string json, IFormFile file)
    {
        try
        {
            var data = new SubcategoryPhoto();
            data = JsonConvert.DeserializeObject<SubcategoryPhoto>(json);
            data.UserId = User.GetUserId();
            if (file != null)
            {
                await s3ObjectCustom.Add($"{User.GetClaimValue<string>(IdCardCompany)}/articulos/", file, data.S3ObjectKey,
                    data.S3ObjectUrl);
            }

            var response = await subcategoryPhoto.UpdateAsync(id, data);
            if (response.Code == "1" && file != null)
            {
                var s3Response = await storageService.UpdateAsync(s3ObjectCustom);
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await subcategoryPhoto.DeleteAsync(id, User.GetUserId());
        return Ok(response);
    }
}
