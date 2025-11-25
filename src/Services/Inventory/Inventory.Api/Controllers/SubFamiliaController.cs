namespace Inventory.Api.Controllers;

public class SubFamiliaController(
    S3ObjectCustom s3ObjectCustom,
    IS3StorageService storageService,
    ISubFamiliaService service)
    : BaseApiController
{
    private const string BucketDirectory = "/subcategorias/";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await service.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(string json, IFormFile file)
    {
        if (file != null)
            await s3ObjectCustom.Initialize($"{User.GetClaimValue<string>("idCardCompany")}{BucketDirectory}", file);

        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) },
            { "s3ObjectKey", s3ObjectCustom.S3ObjectKey ?? "" },
            { "s3ObjectUrl", s3ObjectCustom.S3ObjectUrl ?? "" }
        };

        var response = await service.AddAsync(parameters);

        if (response.Code == "1" && file != null) await storageService.UploadAsync(s3ObjectCustom);

        if (file != null)
        {
        }

        ;
        return Ok(response);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> PostApp(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) },
            { "s3ObjectKey", s3ObjectCustom.S3ObjectKey ?? "" },
            { "s3ObjectUrl", s3ObjectCustom.S3ObjectUrl ?? "" }
        };

        var response = await service.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id },
            { "json", SqlStringParam.Sanitize(json) }
        };

        var response = await service.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };

        var response = await service.DeleteAsync(parameters);
        return Ok(response);
    }
}
