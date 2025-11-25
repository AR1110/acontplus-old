using Acontplus.Core.Extensions;

namespace Inventory.Api.Controllers;

public class ArticuloController(
    S3ObjectCustom s3ObjectCustom,
    IS3StorageService storageService,
    IArticuloService articuloService)
    : BaseApiController
{
    private const string BucketDirectory = "/articulos/";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        if (!DataValidation.IsValidJson(json)) return BadRequest("Caracteres de busqueda invalidos");

        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await articuloService.GetAsync(parameters));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        return Ok(await articuloService.GetByIdAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post(string json, IFormFile file)
    {
        var data = JsonExtensions.DeserializeOptimized<CreateArticuloDto>(json);

        if (file != null)
            await s3ObjectCustom.Initialize($"{User.GetClaimValue<string>("idCardCompany")}{BucketDirectory}", file);

        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateArticuloDto>(data!)) },
        { "s3ObjectKey", s3ObjectCustom.S3ObjectKey ?? "" },
        { "s3ObjectUrl", s3ObjectCustom.S3ObjectUrl ?? "" }
    };
        var response = await articuloService.AddAsync(parameters);

        switch (response.Code)
        {
            case "1" when file != null:
                {
                    var s3Response = await storageService.UploadAsync(s3ObjectCustom);

                    break;
                }
        }

        return Ok(response);
    }

    /**
     * Se agrega este metódo porque ocurre un montón de problemas
     * con métodos que aceptan argumentos de tipo archivo
     */
    [HttpPost("PostByApp")]
    public async Task<IActionResult> PostByApp(string json)
    {
        var data = JsonExtensions.DeserializeOptimized<CreateArticuloDto>(json);

        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateArticuloDto>(data!)) },
        { "s3ObjectKey", "" },
        { "s3ObjectUrl", "" }
    };

        return Ok(await articuloService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var data = JsonExtensions.DeserializeOptimized<UpdateArticuloDto>(json);
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "id", id },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateArticuloDto>(data!)) }
    };

        return Ok(await articuloService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        return Ok(await articuloService.DeleteAsync(parameters));
    }

    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        if (!DataValidation.IsValidJson(json)) return BadRequest("Caracteres de busqueda invalidos");

        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(json) }
    };

        return Ok(await articuloService.SearchAsync(parameters));
    }
}
